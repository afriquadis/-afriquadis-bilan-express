#!/bin/bash

# Script de déploiement AFRIQUADIS - Bilan Express Pro
# Usage: ./deploy.sh [production|staging]

set -e

ENVIRONMENT=${1:-production}
APP_NAME="afriquadis-bilan-express"

echo "🚀 Déploiement de $APP_NAME en mode $ENVIRONMENT..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Assurez-vous d'être dans le répertoire du projet."
    exit 1
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm ci --only=production

# Générer les types Prisma
echo "🔧 Génération des types Prisma..."
npx prisma generate

# Build de l'application
echo "🏗️ Build de l'application..."
npm run build

# Vérifier que le build a réussi
if [ $? -eq 0 ]; then
    echo "✅ Build réussi !"
else
    echo "❌ Erreur lors du build"
    exit 1
fi

# Redémarrer l'application avec PM2 (si installé)
if command -v pm2 &> /dev/null; then
    echo "🔄 Redémarrage avec PM2..."
    pm2 restart $APP_NAME || pm2 start ecosystem.config.js --env $ENVIRONMENT
    echo "✅ Application redémarrée avec PM2"
else
    echo "⚠️ PM2 non installé. Redémarrage manuel requis."
    echo "💡 Pour installer PM2: npm install -g pm2"
fi

echo "🎉 Déploiement terminé avec succès !"
echo "🌐 L'application est accessible sur le port 3000"
echo "📱 PWA disponible pour installation sur mobile"
