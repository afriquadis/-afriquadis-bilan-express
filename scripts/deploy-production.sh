#!/bin/bash

# Script de Déploiement Production AFRIQUADIS
set -e

echo "🚀 Déploiement de Production AFRIQUADIS"
echo "========================================"

# Vérification des prérequis
check_prerequisites() {
    echo "🔍 Vérification des prérequis..."
    
    # Vérification de Docker
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker n'est pas installé"
        exit 1
    fi
    
    # Vérification de Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        echo "❌ Docker Compose n'est pas installé"
        exit 1
    fi
    
    # Vérification des variables d'environnement
    if [ -z "$DB_PASSWORD" ]; then
        echo "❌ DB_PASSWORD n'est pas défini"
        exit 1
    fi
    
    if [ -z "$NEXTAUTH_SECRET" ]; then
        echo "❌ NEXTAUTH_SECRET n'est pas défini"
        exit 1
    fi
    
    if [ -z "$REDIS_PASSWORD" ]; then
        echo "❌ REDIS_PASSWORD n'est pas défini"
        exit 1
    fi
    
    echo "✅ Tous les prérequis sont satisfaits"
}

# Sauvegarde de la base de données
backup_database() {
    echo "💾 Sauvegarde de la base de données..."
    
    if [ -d "backups" ]; then
        mkdir -p backups
    fi
    
    BACKUP_FILE="backups/afriquadis_backup_$(date +%Y%m%d_%H%M%S).sql"
    
    docker exec afriquadis-postgres pg_dump -U afriquadis_user afriquadis_prod > "$BACKUP_FILE"
    
    if [ $? -eq 0 ]; then
        echo "✅ Sauvegarde créée: $BACKUP_FILE"
    else
        echo "⚠️ Échec de la sauvegarde, continuation..."
    fi
}

# Arrêt des services existants
stop_services() {
    echo "🛑 Arrêt des services existants..."
    
    docker-compose -f docker-compose.production.yml down --remove-orphans
    
    echo "✅ Services arrêtés"
}

# Nettoyage des anciens builds
cleanup_old_builds() {
    echo "🧹 Nettoyage des anciens builds..."
    
    docker system prune -f
    docker image prune -f
    
    echo "✅ Nettoyage terminé"
}

# Build de l'application
build_application() {
    echo "🏗️ Build de l'application..."
    
    # Build de l'image Docker
    docker build -f Dockerfile.production -t afriquadis-bilan-express:latest .
    
    if [ $? -eq 0 ]; then
        echo "✅ Build de l'application réussi"
    else
        echo "❌ Échec du build de l'application"
        exit 1
    fi
}

# Démarrage des services
start_services() {
    echo "🚀 Démarrage des services..."
    
    # Démarrage des services de base
    docker-compose -f docker-compose.production.yml up -d postgres redis
    
    echo "⏳ Attente de la disponibilité de la base de données..."
    sleep 30
    
    # Vérification de la base de données
    docker exec afriquadis-postgres pg_isready -U afriquadis_user -d afriquadis_prod
    
    if [ $? -eq 0 ]; then
        echo "✅ Base de données prête"
    else
        echo "❌ Base de données non disponible"
        exit 1
    fi
    
    # Migration de la base de données
    echo "🗄️ Migration de la base de données..."
    docker exec afriquadis-app npx prisma migrate deploy
    
    # Démarrage de l'application
    docker-compose -f docker-compose.production.yml up -d afriquadis-app
    
    # Attente du démarrage de l'application
    echo "⏳ Attente du démarrage de l'application..."
    sleep 30
    
    # Démarrage des autres services
    docker-compose -f docker-compose.production.yml up -d nginx prometheus grafana
    
    echo "✅ Tous les services sont démarrés"
}

# Vérification de la santé des services
health_check() {
    echo "🏥 Vérification de la santé des services..."
    
    # Vérification de l'application
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "✅ Application AFRIQUADIS: OK"
    else
        echo "❌ Application AFRIQUADIS: KO"
        return 1
    fi
    
    # Vérification de Nginx
    if curl -f http://localhost:80 > /dev/null 2>&1; then
        echo "✅ Nginx: OK"
    else
        echo "❌ Nginx: KO"
        return 1
    fi
    
    # Vérification de Prometheus
    if curl -f http://localhost:9090 > /dev/null 2>&1; then
        echo "✅ Prometheus: OK"
    else
        echo "❌ Prometheus: KO"
        return 1
    fi
    
    # Vérification de Grafana
    if curl -f http://localhost:3001 > /dev/null 2>&1; then
        echo "✅ Grafana: OK"
    else
        echo "❌ Grafana: KO"
        return 1
    fi
    
    echo "✅ Tous les services sont en bonne santé"
}

# Affichage des informations de déploiement
show_deployment_info() {
    echo ""
    echo "🎉 Déploiement terminé avec succès !"
    echo "====================================="
    echo "🌐 Application: http://localhost:3000"
    echo "📊 Prometheus: http://localhost:9090"
    echo "📈 Grafana: http://localhost:3001"
    echo "🗄️ Base de données: localhost:5432"
    echo "🔴 Redis: localhost:6379"
    echo ""
    echo "📋 Commandes utiles:"
    echo "  - Voir les logs: docker-compose -f docker-compose.production.yml logs -f"
    echo "  - Arrêter: docker-compose -f docker-compose.production.yml down"
    echo "  - Redémarrer: docker-compose -f docker-compose.production.yml restart"
    echo ""
}

# Fonction principale
main() {
    check_prerequisites
    backup_database
    stop_services
    cleanup_old_builds
    build_application
    start_services
    health_check
    show_deployment_info
}

# Exécution du script
main "$@"
