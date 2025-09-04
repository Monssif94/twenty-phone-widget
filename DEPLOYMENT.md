# 🚀 Guide de Déploiement - Twenty Phone Widget

## 📋 Prérequis Serveur

- Ubuntu 20.04+ ou Debian 11+
- Docker et Docker Compose installés
- Nginx installé
- Certificat SSL (recommandé)
- Ports ouverts : 80, 443, 3001, 3003

## 🔧 Installation sur VPS

### 1. Connexion au serveur

```bash
ssh root@91.134.59.137
```

### 2. Cloner le repository

```bash
cd /var/www
git clone https://github.com/Monssif94/twenty-phone-widget.git
cd twenty-phone-widget
```

### 3. Créer le fichier .env.production

```bash
cp .env.example .env.production
nano .env.production
```

Ajouter vos credentials réels :

```env
# Twilio Configuration
VITE_TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_TWILIO_API_KEY_SID=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_TWILIO_API_KEY_SECRET=your-real-api-secret
VITE_TWILIO_TWIML_APP_SID=APxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_TWILIO_PHONE_NUMBER=+33159130001
VITE_TOKEN_SERVER_URL=https://widget.autoformai.fr/api

# Twenty CRM
VITE_TWENTY_API_TOKEN=your-real-twenty-token
VITE_TWENTY_API_URL=https://crm.autoformai.fr/graphql

# Production
NODE_ENV=production
```

### 4. Build et lancement avec Docker Compose

```bash
docker-compose up -d --build
```

## 🌐 Configuration Nginx

```nginx
server {
    listen 80;
    server_name widget.autoformai.fr;
    
    location / {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 Monitoring

```bash
# Logs
docker-compose logs -f

# Health check
curl http://localhost:3001/health
```

---

**Support :** https://github.com/Monssif94/twenty-phone-widget/issues