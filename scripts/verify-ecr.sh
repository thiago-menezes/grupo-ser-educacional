#!/bin/bash

##############################################################################
# Script para verificar e configurar variáveis ECR
##############################################################################

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}ℹ️  Verificando repositórios ECR...${NC}"
echo ""

# Listar repositórios
echo "Repositórios ECR existentes:"
aws ecr describe-repositories \
  --query 'repositories[].[repositoryName,repositoryUri]' \
  --output table

echo ""

# Obter URIs corretos
NEXT_ECR=$(aws ecr describe-repositories \
  --repository-names grupo-ser/next-test \
  --query 'repositories[0].repositoryUri' \
  --output text 2>/dev/null)

STRAPI_ECR=$(aws ecr describe-repositories \
  --repository-names grupo-ser/strapi-test \
  --query 'repositories[0].repositoryUri' \
  --output text 2>/dev/null)

if [ -z "$NEXT_ECR" ]; then
    echo -e "${YELLOW}⚠️  Repositório Next.js não encontrado${NC}"
    echo "Criando repositório grupo-ser/next-test..."
    aws ecr create-repository \
      --repository-name grupo-ser/next-test \
      --image-scanning-configuration scanOnPush=true

    NEXT_ECR=$(aws ecr describe-repositories \
      --repository-names grupo-ser/next-test \
      --query 'repositories[0].repositoryUri' \
      --output text)
fi

if [ -z "$STRAPI_ECR" ]; then
    echo -e "${YELLOW}⚠️  Repositório Strapi não encontrado${NC}"
    echo "Criando repositório grupo-ser/strapi-test..."
    aws ecr create-repository \
      --repository-name grupo-ser/strapi-test \
      --image-scanning-configuration scanOnPush=true

    STRAPI_ECR=$(aws ecr describe-repositories \
      --repository-names grupo-ser/strapi-test \
      --query 'repositories[0].repositoryUri' \
      --output text)
fi

echo ""
echo -e "${GREEN}✅ Repositórios configurados:${NC}"
echo ""
echo "NEXT_ECR=$NEXT_ECR"
echo "STRAPI_ECR=$STRAPI_ECR"
echo ""
echo -e "${BLUE}ℹ️  Execute estes comandos para definir as variáveis:${NC}"
echo ""
echo "export NEXT_ECR=$NEXT_ECR"
echo "export STRAPI_ECR=$STRAPI_ECR"
echo ""
echo -e "${YELLOW}Ou copie e cole:${NC}"
echo ""
cat <<EOF
export NEXT_ECR=$NEXT_ECR
export STRAPI_ECR=$STRAPI_ECR
EOF
