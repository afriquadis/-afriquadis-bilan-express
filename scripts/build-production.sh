#!/bin/bash

# Script de Build Production AFRIQUADIS
echo "🚀 Démarrage du build de production AFRIQUADIS..."

# Vérification de l'environnement
if [ "$NODE_ENV" != "production" ]; then
    export NODE_ENV=production
    echo "✅ NODE_ENV défini sur production"
fi

# Nettoyage des anciens builds
echo "🧹 Nettoyage des anciens builds..."
rm -rf .next
rm -rf out
rm -rf dist
rm -rf build

# Installation des dépendances de production
echo "📦 Installation des dépendances de production..."
npm ci --only=production

# Génération du client Prisma
echo "🗄️ Génération du client Prisma..."
npx prisma generate

# Vérification des types TypeScript
echo "🔍 Vérification des types TypeScript..."
npm run type-check

# Linting du code
echo "✨ Linting du code..."
npm run lint

# Build de production
echo "🏗️ Build de production en cours..."
npm run build

# Vérification du build
if [ -d ".next" ]; then
    echo "✅ Build réussi !"
    echo "📊 Taille du build:"
    du -sh .next
    
    # Optimisations supplémentaires
    echo "🚀 Optimisations de production..."
    
    # Compression des assets
    if command -v gzip &> /dev/null; then
        echo "🗜️ Compression des assets..."
        find .next -name "*.js" -exec gzip -9 {} \;
        find .next -name "*.css" -exec gzip -9 {} \;
    fi
    
    # Vérification des bundles
    echo "📦 Analyse des bundles..."
    npm run analyze
    
    echo "🎉 Build de production terminé avec succès !"
    echo "📍 Dossier: .next/"
    echo "🚀 Pour démarrer: npm run start"
else
    echo "❌ Échec du build !"
    exit 1
fi
