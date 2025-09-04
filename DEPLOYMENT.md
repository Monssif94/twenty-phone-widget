# 🚀 Guide de Déploiement - Twenty Phone Widget

## Déploiement Rapide sur VPS

### Option 1 : Script Automatique

```bash
# Depuis votre machine locale
./deploy.sh staging
# ou
./deploy.sh production
```

### Option 2 : Déploiement Manuel

#### 1. Connexion au serveur

```bash
ssh root@91.134.59.137
```

#### 2. Cloner le projet

```bash
cd /opt
git clone https://github.com/Monssif94/twenty-phone-widget.git
cd twenty-phone-widget
```

#### 3. Configuration des variables d'environnement

```bash
cp .env.example .env.local
nano .env.local
```

Ajouter vos credentials :

```env
VITE_TWILIO_SIP_DOMAIN=autoformai-widget.sip.twilio.com
VITE_TWILIO_SIP_USERNAME=agent1
VITE_TWILIO_SIP_PASSWORD=Widget2025Secure!
VITE_TWILIO_PHONE_NUMBER=+33159130001
VITE_TWENTY_API_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 4. Build avec Docker

```bash
# Build de l'image
docker build -t twenty-phone-widget .

# Ou avec docker-compose
docker-compose build
docker-compose up -d
```

#### 5. Configuration Nginx

```bash
# Créer la configuration
cat > /etc/nginx/sites-available/widget.autoformai.fr << 'EOF'
server {
    listen 80;
    server_name widget.autoformai.fr;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # WebSocket pour JsSIP
    location /ws {
        proxy_pass https://autoformai-widget.sip.twilio.com;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400;
    }
}
EOF

# Activer le site
ln -sf /etc/nginx/sites-available/widget.autoformai.fr /etc/nginx/sites-enabled/

# Tester la configuration
nginx -t

# Recharger Nginx
systemctl reload nginx
```

#### 6. Certificat SSL

```bash
certbot --nginx -d widget.autoformai.fr --non-interactive --agree-tos -m admin@autoformai.fr
```

#### 7. Firewall

```bash
# Ouvrir les ports nécessaires
ufw allow 443/tcp  # HTTPS
ufw allow 80/tcp   # HTTP
ufw allow 10000:60000/udp  # RTP pour WebRTC
```

## 🔧 Maintenance

### Voir les logs

```bash
# Logs Docker
docker-compose logs -f

# Logs Nginx
tail -f /var/log/nginx/error.log
```

### Redémarrer l'application

```bash
cd /opt/twenty-phone-widget
docker-compose restart
```

### Mettre à jour

```bash
cd /opt/twenty-phone-widget
git pull origin main
docker-compose build
docker-compose up -d
```

## 🧪 Test de l'installation

1. Ouvrir https://widget.autoformai.fr
2. Vérifier dans la console du navigateur :
   - "✅ Connected to Twilio SIP"
   - "📞 Registered with SIP server"
3. Tester un appel sortant
4. Vérifier les logs Docker pour les erreurs

## 🐛 Dépannage

### Problème : "WebSocket connection failed"

```bash
# Vérifier que le port 443 est ouvert
nmap -p 443 autoformai-widget.sip.twilio.com

# Vérifier les logs Docker
docker-compose logs | grep WebSocket
```

### Problème : "Registration failed"

1. Vérifier les credentials dans `.env.local`
2. Vérifier dans Twilio Console que le domaine SIP est actif
3. Vérifier les Credential Lists dans Twilio

### Problème : "No audio"

```bash
# Vérifier les ports RTP
iptables -L -n | grep udp
# Doit montrer : ACCEPT udp -- 0.0.0.0/0  0.0.0.0/0  udp dpts:10000:60000
```

## 📊 Monitoring

### Health Check

```bash
curl https://widget.autoformai.fr/health
# Doit retourner : healthy
```

### Métriques Docker

```bash
docker stats twenty-phone-widget
```

## 🔐 Sécurité

- **Ne jamais** commiter `.env.local`
- Utiliser des mots de passe forts pour Twilio SIP
- Activer le pare-feu (UFW)
- Mettre à jour régulièrement les dépendances
- Surveiller les logs pour détecter les tentatives d'intrusion

## 📞 Support

Pour toute question ou problème :
- GitHub Issues : https://github.com/Monssif94/twenty-phone-widget/issues
- Email : admin@autoformai.fr