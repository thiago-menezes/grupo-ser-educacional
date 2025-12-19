#!/bin/bash

##############################################################################
# Script para definir variáveis de ambiente ECR
#
# USO: source ./scripts/set-ecr-vars.sh
#      OU
#      . ./scripts/set-ecr-vars.sh
##############################################################################

echo "🔧 Configurando variáveis ECR..."

# Obter URIs dos repositórios
export NEXT_ECR=$(aws ecr describe-repositories \
  --repository-names grupo-ser/next-test \
  --query 'repositories[0].repositoryUri' \
  --output text 2>/dev/null)

export STRAPI_ECR=$(aws ecr describe-repositories \
  --repository-names grupo-ser/strapi-test \
  --query 'repositories[0].repositoryUri' \
  --output text 2>/dev/null)

if [ -z "$NEXT_ECR" ]; then
    echo "❌ Erro: Repositório grupo-ser/next-test não encontrado"
    echo "Execute primeiro: aws ecr create-repository --repository-name grupo-ser/next-test"
    return 1 2>/dev/null || exit 1
fi

if [ -z "$STRAPI_ECR" ]; then
    echo "❌ Erro: Repositório grupo-ser/strapi-test não encontrado"
    echo "Execute primeiro: aws ecr create-repository --repository-name grupo-ser/strapi-test"
    return 1 2>/dev/null || exit 1
fi

echo ""
echo "✅ Variáveis configuradas:"
echo ""
echo "NEXT_ECR=$NEXT_ECR"
echo "STRAPI_ECR=$STRAPI_ECR"
echo ""
echo "✅ Variáveis exportadas para esta sessão do terminal"
echo ""
