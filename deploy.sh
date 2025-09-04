#!/bin/bash

# Twenty Phone Widget - Deployment Script
# Usage: ./deploy.sh [staging|production]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SERVER_IP="91.134.59.137"
SERVER_USER="root"
ENVIRONMENT="${1:-staging}"
DEPLOY_PATH="/opt/twenty-phone-widget"
DOMAIN=""

if [ "$ENVIRONMENT" = "production" ]; then
    DOMAIN="widget.autoformai.fr"
else
    DOMAIN="staging-widget.autoformai.fr"
fi

echo -e "${GREEN}🚀 Deploying Twenty Phone Widget to $ENVIRONMENT${NC}"
echo -e "Server: $SERVER_USER@$SERVER_IP"
echo -e "Domain: $DOMAIN"
echo ""

# Step 1: Build locally
echo -e "${YELLOW}📦 Building application...${NC}"
npm install
npm run build

# Step 2: Create deployment package
echo -e "${YELLOW}📤 Creating deployment package...${NC}"
tar -czf deploy.tar.gz \
    dist \
    Dockerfile \
    docker-compose.yml \
    nginx.conf \
    package.json \
    package-lock.json \
    .env.example

# Step 3: Upload to server
echo -e "${YELLOW}📤 Uploading to server...${NC}"
scp deploy.tar.gz $SERVER_USER@$SERVER_IP:/tmp/

# Step 4: Deploy on server
echo -e "${YELLOW}🔧 Deploying on server...${NC}"
ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'
    # Create directory
    mkdir -p $DEPLOY_PATH
    cd $DEPLOY_PATH
    
    # Extract files
    tar -xzf /tmp/deploy.tar.gz
    rm /tmp/deploy.tar.gz
    
    # Check if .env.local exists
    if [ ! -f .env.local ]; then
        echo "⚠️  Please create .env.local with your credentials"
        cp .env.example .env.local
    fi
    
    # Build and run with Docker
    docker-compose down || true
    docker-compose build
    docker-compose up -d
    
    echo "✅ Deployment complete!"
ENDSSH

# Step 5: Configure Nginx (if not already done)
echo -e "${YELLOW}🔧 Configuring Nginx...${NC}"
ssh $SERVER_USER@$SERVER_IP << ENDSSH
    # Create Nginx config
    cat > /etc/nginx/sites-available/$DOMAIN << 'EOF'
server {
    listen 80;
    server_name $DOMAIN;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
    
    # Enable site
    ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
    
    # Test and reload Nginx
    nginx -t && systemctl reload nginx
    
    # Get SSL certificate
    if ! [ -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem ]; then
        certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m admin@autoformai.fr
    fi
ENDSSH

# Clean up
rm deploy.tar.gz

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "Visit: https://$DOMAIN"
echo ""
echo -e "${YELLOW}📝 Next steps:${NC}"
echo "1. SSH to server: ssh $SERVER_USER@$SERVER_IP"
echo "2. Edit configuration: cd $DEPLOY_PATH && nano .env.local"
echo "3. View logs: docker-compose logs -f"
echo "4. Restart: docker-compose restart"