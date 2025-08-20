#!/bin/bash

# Script de déploiement Azure pour AFRIQUADIS - Bilan Express Pro
# Prérequis: Azure CLI configuré, Docker installé

set -e

APP_NAME="afriquadis-bilan-express"
RESOURCE_GROUP="afriquadis-rg"
LOCATION="eastus"
ACR_NAME="afriquadisacr"
APP_SERVICE_PLAN="afriquadis-plan"
WEB_APP_NAME="afriquadis-webapp"

echo "🚀 Déploiement Azure de $APP_NAME..."

# Vérifier que Azure CLI est configuré
if ! az account show &> /dev/null; then
    echo "❌ Erreur: Azure CLI non configuré. Connectez-vous d'abord avec 'az login'."
    exit 1
fi

# Créer le groupe de ressources
echo "🏗️ Création du groupe de ressources..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# Créer le registre de conteneurs
echo "📦 Création du registre de conteneurs..."
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Basic

# Activer l'accès admin au registre
az acr update -n $ACR_NAME --admin-enabled true

# Récupérer les credentials du registre
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --resource-group $RESOURCE_GROUP --query "loginServer" --output tsv)
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query "username" --output tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query "passwords[0].value" --output tsv)

# Build et push de l'image
echo "🔨 Build et push de l'image Docker..."
docker build -t $APP_NAME .
docker tag $APP_NAME $ACR_LOGIN_SERVER/$APP_NAME:latest
docker login $ACR_LOGIN_SERVER -u $ACR_USERNAME -p $ACR_PASSWORD
docker push $ACR_LOGIN_SERVER/$APP_NAME:latest

# Créer le plan App Service
echo "📋 Création du plan App Service..."
az appservice plan create --name $APP_SERVICE_PLAN --resource-group $RESOURCE_GROUP --sku B1 --is-linux

# Créer l'application web
echo "🌐 Création de l'application web..."
az webapp create --resource-group $RESOURCE_GROUP --plan $APP_SERVICE_PLAN --name $WEB_APP_NAME --deployment-container-image-name $ACR_LOGIN_SERVER/$APP_NAME:latest

# Configurer l'application web
echo "⚙️ Configuration de l'application web..."
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $WEB_APP_NAME --settings \
    WEBSITES_PORT=3000 \
    NODE_ENV=production \
    NEXTAUTH_SECRET=$(openssl rand -base64 32) \
    NEXTAUTH_URL=https://$WEB_APP_NAME.azurewebsites.net

# Activer les logs
az webapp log config --resource-group $RESOURCE_GROUP --name $WEB_APP_NAME --web-server-logging filesystem

echo "✅ Déploiement Azure terminé avec succès !"
echo "🌐 L'application est accessible sur: https://$WEB_APP_NAME.azurewebsites.net"
echo "📊 Surveillez le statut: az webapp show --name $WEB_APP_NAME --resource-group $RESOURCE_GROUP"
