#!/bin/bash

# Script de déploiement Google Cloud Platform pour AFRIQUADIS - Bilan Express Pro
# Prérequis: gcloud CLI configuré, Docker installé

set -e

APP_NAME="afriquadis-bilan-express"
PROJECT_ID="afriquadis-project"
REGION="us-central1"
SERVICE_NAME="afriquadis-service"

echo "🚀 Déploiement Google Cloud Platform de $APP_NAME..."

# Vérifier que gcloud CLI est configuré
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Erreur: gcloud CLI non configuré. Configurez d'abord vos credentials."
    exit 1
fi

# Définir le projet
echo "🔧 Configuration du projet GCP..."
gcloud config set project $PROJECT_ID

# Activer les APIs nécessaires
echo "🔌 Activation des APIs GCP..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com

# Build et déploiement avec Cloud Build
echo "🏗️ Build et déploiement avec Cloud Build..."
gcloud run deploy $SERVICE_NAME \
  --source . \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production" \
  --set-env-vars="NEXTAUTH_SECRET=$(openssl rand -base64 32)" \
  --set-env-vars="NEXTAUTH_URL=https://$SERVICE_NAME-$REGION-$PROJECT_ID.a.run.app"

echo "✅ Déploiement Google Cloud Platform terminé avec succès !"
echo "🌐 L'application est accessible sur: https://$SERVICE_NAME-$REGION-$PROJECT_ID.a.run.app"
echo "📊 Surveillez le statut: gcloud run services describe $SERVICE_NAME --region $REGION"
