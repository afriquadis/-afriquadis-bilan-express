#!/bin/bash

# Script de déploiement AWS pour AFRIQUADIS - Bilan Express Pro
# Prérequis: AWS CLI configuré, Docker installé

set -e

APP_NAME="afriquadis-bilan-express"
AWS_REGION="us-east-1"
ECR_REPOSITORY="afriquadis-bilan-express"
ECS_CLUSTER="afriquadis-cluster"
ECS_SERVICE="afriquadis-service"
ECS_TASK_DEFINITION="afriquadis-task"

echo "🚀 Déploiement AWS de $APP_NAME..."

# Vérifier que AWS CLI est configuré
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ Erreur: AWS CLI non configuré. Configurez d'abord vos credentials."
    exit 1
fi

# Build de l'image Docker
echo "🏗️ Build de l'image Docker..."
docker build -t $APP_NAME .

# Tag de l'image pour ECR
echo "🏷️ Tag de l'image pour ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com

docker tag $APP_NAME:latest $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:latest

# Push vers ECR
echo "📤 Push vers ECR..."
docker push $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:latest

# Mise à jour du service ECS
echo "🔄 Mise à jour du service ECS..."
aws ecs update-service --cluster $ECS_CLUSTER --service $ECS_SERVICE --force-new-deployment --region $AWS_REGION

echo "✅ Déploiement AWS terminé avec succès !"
echo "🌐 L'application sera accessible dans quelques minutes"
echo "📊 Surveillez le statut: aws ecs describe-services --cluster $ECS_CLUSTER --services $ECS_SERVICE --region $AWS_REGION"
