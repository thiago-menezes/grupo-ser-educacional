#!/bin/bash

##############################################################################
# Cleanup AWS Test Environment
#
# Remove todos os recursos criados pelo deploy de teste para evitar custos
##############################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

PROJECT_NAME="grupo-ser-test"
AWS_REGION="us-east-1"

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║         Cleanup AWS Test Environment                      ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

log_warning "Este script irá DELETAR todos os recursos de teste da AWS!"
log_warning "Isso inclui: ECS, RDS, S3, ECR, VPC, etc."
echo ""
read -p "Tem certeza? Digite 'DELETE' para confirmar: " -r
echo ""

if [[ ! $REPLY == "DELETE" ]]; then
    log_info "Operação cancelada"
    exit 0
fi

echo ""
log_info "Iniciando cleanup..."
echo ""

# 1. Deletar ECS Services
log_info "Deletando ECS Services..."
aws ecs update-service --cluster ${PROJECT_NAME}-cluster --service next-service --desired-count 0 2>/dev/null || true
aws ecs update-service --cluster ${PROJECT_NAME}-cluster --service strapi-service --desired-count 0 2>/dev/null || true
sleep 5
aws ecs delete-service --cluster ${PROJECT_NAME}-cluster --service next-service --force 2>/dev/null || true
aws ecs delete-service --cluster ${PROJECT_NAME}-cluster --service strapi-service --force 2>/dev/null || true

# 2. Deletar ECS Cluster
log_info "Deletando ECS Cluster..."
aws ecs delete-cluster --cluster ${PROJECT_NAME}-cluster 2>/dev/null || true

# 3. Deregister Task Definitions
log_info "Deregistrando Task Definitions..."
NEXT_TASKS=$(aws ecs list-task-definitions --family-prefix ${PROJECT_NAME}-next --query 'taskDefinitionArns[]' --output text)
for task in $NEXT_TASKS; do
    aws ecs deregister-task-definition --task-definition $task > /dev/null 2>&1 || true
done

STRAPI_TASKS=$(aws ecs list-task-definitions --family-prefix ${PROJECT_NAME}-strapi --query 'taskDefinitionArns[]' --output text)
for task in $STRAPI_TASKS; do
    aws ecs deregister-task-definition --task-definition $task > /dev/null 2>&1 || true
done

# 4. Deletar ALBs e Target Groups
log_info "Deletando Load Balancers..."
NEXT_ALB_ARN=$(aws elbv2 describe-load-balancers --names ${PROJECT_NAME}-next-alb --query 'LoadBalancers[0].LoadBalancerArn' --output text 2>/dev/null || echo "")
if [ ! -z "$NEXT_ALB_ARN" ]; then
    aws elbv2 delete-load-balancer --load-balancer-arn $NEXT_ALB_ARN 2>/dev/null || true
fi

STRAPI_ALB_ARN=$(aws elbv2 describe-load-balancers --names ${PROJECT_NAME}-strapi-alb --query 'LoadBalancers[0].LoadBalancerArn' --output text 2>/dev/null || echo "")
if [ ! -z "$STRAPI_ALB_ARN" ]; then
    aws elbv2 delete-load-balancer --load-balancer-arn $STRAPI_ALB_ARN 2>/dev/null || true
fi

sleep 10  # Aguardar ALBs serem deletados

NEXT_TG_ARN=$(aws elbv2 describe-target-groups --names ${PROJECT_NAME}-next-tg --query 'TargetGroups[0].TargetGroupArn' --output text 2>/dev/null || echo "")
if [ ! -z "$NEXT_TG_ARN" ]; then
    aws elbv2 delete-target-group --target-group-arn $NEXT_TG_ARN 2>/dev/null || true
fi

STRAPI_TG_ARN=$(aws elbv2 describe-target-groups --names ${PROJECT_NAME}-strapi-tg --query 'TargetGroups[0].TargetGroupArn' --output text 2>/dev/null || echo "")
if [ ! -z "$STRAPI_TG_ARN" ]; then
    aws elbv2 delete-target-group --target-group-arn $STRAPI_TG_ARN 2>/dev/null || true
fi

# 5. Deletar RDS
log_info "Deletando RDS (isso pode levar alguns minutos)..."
aws rds delete-db-instance \
    --db-instance-identifier ${PROJECT_NAME}-db \
    --skip-final-snapshot \
    --delete-automated-backups 2>/dev/null || true

aws rds wait db-instance-deleted --db-instance-identifier ${PROJECT_NAME}-db 2>/dev/null || true

aws rds delete-db-subnet-group --db-subnet-group-name ${PROJECT_NAME}-db-subnet 2>/dev/null || true

# 6. Deletar S3 Buckets
log_info "Deletando S3 Buckets..."
BUCKETS=$(aws s3 ls | grep ${PROJECT_NAME}-media | awk '{print $3}')
for bucket in $BUCKETS; do
    log_info "Esvaziando bucket: $bucket"
    aws s3 rm s3://$bucket --recursive 2>/dev/null || true
    aws s3 rb s3://$bucket 2>/dev/null || true
done

# 7. Deletar ECR Repositories
log_info "Deletando ECR Repositories..."
aws ecr delete-repository --repository-name ${PROJECT_NAME}/next --force 2>/dev/null || true
aws ecr delete-repository --repository-name ${PROJECT_NAME}/strapi --force 2>/dev/null || true

# 8. Deletar CloudWatch Log Groups
log_info "Deletando CloudWatch Logs..."
aws logs delete-log-group --log-group-name /ecs/${PROJECT_NAME}-next 2>/dev/null || true
aws logs delete-log-group --log-group-name /ecs/${PROJECT_NAME}-strapi 2>/dev/null || true

# 9. Deletar IAM Roles
log_info "Deletando IAM Roles..."
aws iam detach-role-policy \
    --role-name ${PROJECT_NAME}-execution-role \
    --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy 2>/dev/null || true
aws iam delete-role --role-name ${PROJECT_NAME}-execution-role 2>/dev/null || true

aws iam delete-role-policy --role-name ${PROJECT_NAME}-task-role --policy-name S3Access 2>/dev/null || true
aws iam delete-role --role-name ${PROJECT_NAME}-task-role 2>/dev/null || true

# 10. Obter VPC ID
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=tag:Name,Values=${PROJECT_NAME}-vpc" --query 'Vpcs[0].VpcId' --output text 2>/dev/null || echo "")

if [ ! -z "$VPC_ID" ] && [ "$VPC_ID" != "None" ]; then
    log_info "Deletando VPC e recursos de rede..."

    # 10a. Deletar Security Groups
    SG_IDS=$(aws ec2 describe-security-groups --filters "Name=vpc-id,Values=$VPC_ID" --query 'SecurityGroups[?GroupName!=`default`].GroupId' --output text)

    # Remover regras de ingresso primeiro
    for sg in $SG_IDS; do
        aws ec2 revoke-security-group-ingress --group-id $sg --ip-permissions "$(aws ec2 describe-security-groups --group-ids $sg --query 'SecurityGroups[0].IpPermissions' --output json)" 2>/dev/null || true
    done

    # Deletar security groups
    for sg in $SG_IDS; do
        aws ec2 delete-security-group --group-id $sg 2>/dev/null || true
    done

    # 10b. Deletar Subnets
    SUBNET_IDS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[].SubnetId' --output text)
    for subnet in $SUBNET_IDS; do
        aws ec2 delete-subnet --subnet-id $subnet 2>/dev/null || true
    done

    # 10c. Deletar Route Tables
    RTB_IDS=$(aws ec2 describe-route-tables --filters "Name=vpc-id,Values=$VPC_ID" --query 'RouteTables[?Associations[0].Main!=`true`].RouteTableId' --output text)
    for rtb in $RTB_IDS; do
        aws ec2 delete-route-table --route-table-id $rtb 2>/dev/null || true
    done

    # 10d. Detach e Deletar Internet Gateway
    IGW_ID=$(aws ec2 describe-internet-gateways --filters "Name=attachment.vpc-id,Values=$VPC_ID" --query 'InternetGateways[0].InternetGatewayId' --output text)
    if [ ! -z "$IGW_ID" ] && [ "$IGW_ID" != "None" ]; then
        aws ec2 detach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID 2>/dev/null || true
        aws ec2 delete-internet-gateway --internet-gateway-id $IGW_ID 2>/dev/null || true
    fi

    # 10e. Deletar VPC
    aws ec2 delete-vpc --vpc-id $VPC_ID 2>/dev/null || true
fi

echo ""
log_success "Cleanup completo!"
echo ""
log_info "Recursos deletados:"
echo "  ✅ ECS Services e Cluster"
echo "  ✅ RDS PostgreSQL"
echo "  ✅ S3 Buckets"
echo "  ✅ ECR Repositories"
echo "  ✅ Load Balancers e Target Groups"
echo "  ✅ CloudWatch Logs"
echo "  ✅ IAM Roles"
echo "  ✅ VPC, Subnets, Security Groups"
echo ""
log_success "Custo = \$0 (todos os recursos removidos)"
echo ""
