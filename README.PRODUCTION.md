# 🚀 AFRIQUADIS - Guide de Production

## 📋 Vue d'ensemble

Ce guide détaille le déploiement et la configuration de l'application AFRIQUADIS Bilan Express en production.

## 🎯 Objectifs de Production

- **Performance optimisée** : Temps de réponse < 2 secondes
- **Haute disponibilité** : 99.9% uptime
- **Sécurité renforcée** : Headers de sécurité, CORS, rate limiting
- **Monitoring complet** : Prometheus + Grafana
- **Scalabilité** : Architecture microservices avec Docker
- **Backup automatique** : Base de données et fichiers

## 🏗️ Architecture de Production

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Nginx       │    │   Prometheus    │    │     Grafana     │
│  (Reverse Proxy)│    │   (Monitoring)  │    │  (Dashboards)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ AFRIQUADIS App  │    │    PostgreSQL   │    │      Redis      │
│   (Next.js)     │    │   (Database)    │    │     (Cache)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Prérequis

### Système
- **OS** : Linux (Ubuntu 20.04+ recommandé)
- **RAM** : Minimum 4GB, recommandé 8GB+
- **CPU** : Minimum 2 cores, recommandé 4 cores+
- **Stockage** : Minimum 20GB, recommandé 50GB+

### Logiciels
- **Docker** : 20.10+
- **Docker Compose** : 2.0+
- **Git** : 2.30+

## 📦 Installation

### 1. Clonage du Repository
```bash
git clone https://github.com/afriquadis/bilan-express.git
cd bilan-express
```

### 2. Configuration des Variables d'Environnement
```bash
# Copier le fichier d'exemple
cp env.production .env.production

# Éditer avec vos valeurs de production
nano .env.production
```

**Variables obligatoires :**
```bash
# Base de données
DATABASE_URL="postgresql://username:password@host:5432/database"

# Sécurité
NEXTAUTH_SECRET="your-super-secure-secret-key"
NEXTAUTH_URL="https://your-domain.com"

# Cache
REDIS_URL="redis://host:6379"

# Passwords
DB_PASSWORD="your-db-password"
REDIS_PASSWORD="your-redis-password"
GRAFANA_PASSWORD="your-grafana-password"
```

### 3. Déploiement Automatique
```bash
# Rendre le script exécutable
chmod +x scripts/deploy-production.sh

# Lancer le déploiement
./scripts/deploy-production.sh
```

## 🐳 Déploiement Docker

### Démarrage Rapide
```bash
# Avec Docker Compose
docker-compose -f docker-compose.production.yml up -d

# Vérification des services
docker-compose -f docker-compose.production.yml ps
```

### Build Manuel
```bash
# Build de l'image
docker build -f Dockerfile.production -t afriquadis-bilan-express:latest .

# Démarrage des services
docker-compose -f docker-compose.production.yml up -d
```

## 🗄️ Base de Données

### Migration
```bash
# Génération du client Prisma
npx prisma generate

# Migration de la base
npx prisma migrate deploy

# Seed des données (optionnel)
npx prisma db seed
```

### Backup
```bash
# Backup manuel
docker exec afriquadis-postgres pg_dump -U afriquadis_user afriquadis_prod > backup.sql

# Restauration
docker exec -i afriquadis-postgres psql -U afriquadis_user -d afriquadis_prod < backup.sql
```

## 📊 Monitoring

### Prometheus
- **URL** : http://localhost:9090
- **Métriques** : Performance, erreurs, temps de réponse
- **Rétention** : 200 heures

### Grafana
- **URL** : http://localhost:3001
- **Login** : admin
- **Password** : Variable GRAFANA_PASSWORD
- **Dashboards** : AFRIQUADIS, Base de données, Système

## 🔒 Sécurité

### Headers de Sécurité
- **X-Frame-Options** : DENY
- **X-Content-Type-Options** : nosniff
- **Referrer-Policy** : origin-when-cross-origin
- **Permissions-Policy** : Restrictions strictes

### Rate Limiting
- **Limite** : 100 requêtes par fenêtre
- **Fenêtre** : 15 minutes
- **Stratégie** : IP-based

### CORS
- **Origine** : Domaine de production uniquement
- **Méthodes** : GET, POST, PUT, DELETE
- **Headers** : Content-Type, Authorization

## 🚀 Performance

### Optimisations Next.js
- **SWC Minification** : Activée
- **Compression** : Gzip activée
- **Images** : WebP et AVIF supportés
- **Bundle Analyzer** : Disponible

### Cache
- **Redis** : Session et cache d'API
- **Next.js** : Cache statique optimisé
- **CDN** : Prêt pour configuration

## 📱 Application Mobile

### Build APK
```bash
# Installation des dépendances
npm install

# Build de production
npm run production:build

# Génération de l'APK (avec Capacitor)
npx cap build android --prod
```

### Configuration Android
```bash
# Ouvrir le projet Android Studio
npx cap open android

# Build et signer l'APK
# Suivre les étapes de signature de production
```

## 🔄 Maintenance

### Mise à Jour
```bash
# Pull des dernières modifications
git pull origin main

# Rebuild et redéploiement
./scripts/deploy-production.sh
```

### Logs
```bash
# Logs de l'application
docker-compose -f docker-compose.production.yml logs -f afriquadis-app

# Logs de la base de données
docker-compose -f docker-compose.production.yml logs -f postgres

# Logs Nginx
docker-compose -f docker-compose.production.yml logs -f nginx
```

### Sauvegarde Automatique
```bash
# Ajouter au crontab
0 2 * * * /path/to/afriquadis/scripts/backup-database.sh
```

## 🚨 Dépannage

### Problèmes Courants

#### Application ne démarre pas
```bash
# Vérifier les logs
docker-compose -f docker-compose.production.yml logs afriquadis-app

# Vérifier la base de données
docker exec afriquadis-postgres pg_isready -U afriquadis_user
```

#### Base de données inaccessible
```bash
# Vérifier le statut du conteneur
docker ps | grep postgres

# Redémarrer le service
docker-compose -f docker-compose.production.yml restart postgres
```

#### Problèmes de performance
```bash
# Vérifier l'utilisation des ressources
docker stats

# Analyser les métriques Prometheus
# Vérifier les logs d'erreur
```

## 📞 Support

### Contacts
- **Développeur** : [Votre nom]
- **Email** : [votre-email@afriquadis.com]
- **Documentation** : [Lien vers la documentation]

### Ressources
- **GitHub** : [Repository]
- **Wiki** : [Lien vers le wiki]
- **Issues** : [Lien vers les issues]

## 📈 Métriques de Production

### Objectifs
- **Uptime** : 99.9%
- **Temps de réponse** : < 2s (moyenne)
- **Erreurs 5xx** : < 0.1%
- **Utilisation CPU** : < 80%
- **Utilisation RAM** : < 85%

### Alertes
- **Prometheus** : Configuration des alertes
- **Grafana** : Dashboards de monitoring
- **Email/SMS** : Notifications automatiques

---

## 🎉 Félicitations !

Votre application AFRIQUADIS est maintenant prête pour la production avec :
- ✅ Architecture scalable
- ✅ Monitoring complet
- ✅ Sécurité renforcée
- ✅ Performance optimisée
- ✅ Backup automatique
- ✅ Déploiement automatisé

**Bon déploiement ! 🚀**
