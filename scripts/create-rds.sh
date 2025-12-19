#!/bin/bash

# Script para criar RDS PostgreSQL
# Evita problemas com aspas ao copiar/colar comandos multi-linha

set -e

# Verificar se variáveis estão definidas
if [ -z "$RDS_SG" ]; then
    echo "❌ Erro: Variável RDS_SG não definida"
    echo "Execute primeiro os comandos de criação do Security Group"
    exit 1
fi

if [ -z "$SUBNET_1" ] || [ -z "$SUBNET_2" ]; then
    echo "❌ Erro: Variáveis SUBNET_1 e SUBNET_2 não definidas"
    echo "Execute primeiro os comandos de criação das Subnets"
    exit 1
fi

echo "ℹ️  Criando DB Subnet Group..."
aws rds create-db-subnet-group \
  --db-subnet-group-name grupo-ser-test-db-subnet \
  --db-subnet-group-description "Grupo SER Test DB Subnet Group" \
  --subnet-ids "$SUBNET_1" "$SUBNET_2"

echo "ℹ️  Criando RDS PostgreSQL (FREE TIER)..."
echo "   - Instance: db.t3.micro"
echo "   - Storage: 20GB"
echo "   - Single-AZ (gratuito)"
echo ""

aws rds create-db-instance \
  --db-instance-identifier grupo-ser-test-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.15 \
  --master-username postgres \
  --master-user-password ChangeMeL8er123! \
  --allocated-storage 20 \
  --storage-type gp2 \
  --vpc-security-group-ids "$RDS_SG" \
  --db-subnet-group-name grupo-ser-test-db-subnet \
  --publicly-accessible \
  --backup-retention-period 0 \
  --no-multi-az \
  --no-deletion-protection \
  --tags Key=Name,Value=grupo-ser-test-db

echo ""
echo "⏳ RDS criando... (leva ~10 minutos)"
echo ""
echo "Acompanhe o status com:"
echo "  aws rds describe-db-instances --db-instance-identifier grupo-ser-test-db --query 'DBInstances[0].DBInstanceStatus'"
echo ""
echo "Aguarde até o status ficar 'available'"
echo ""

# Aguardar disponibilidade
echo "Aguardando RDS ficar disponível..."
aws rds wait db-instance-available --db-instance-identifier grupo-ser-test-db

# Obter endpoint
DB_ENDPOINT=$(aws rds describe-db-instances \
  --db-instance-identifier grupo-ser-test-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text)

echo ""
echo "✅ RDS criado com sucesso!"
echo ""
echo "Endpoint: $DB_ENDPOINT"
echo "Username: postgres"
echo "Password: ChangeMeL8er123!"
echo "Database: postgres"
echo ""
echo "Connection string:"
echo "postgresql://postgres:ChangeMeL8er123!@$DB_ENDPOINT:5432/postgres"
echo ""
echo "Exporte a variável de ambiente:"
echo "export DB_ENDPOINT=$DB_ENDPOINT"
