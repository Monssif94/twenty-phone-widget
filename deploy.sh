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
ENVIRONMENT=${1:-staging}
SERVER_IP="91.134.59.137"
SERVER_USER="root"
DEPLOY_PATH="/var/www/twenty-phone-widget"
GITHUB_REPO="https://github.com/Monssif94/twenty-phone-widget.git"

echo -e "${GREEN}🚀 Deploying Twenty Phone Widget to ${ENVIRONMENT}${NC}"

# Function to check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}📋 Checking prerequisites...${NC}"
    
    # Check if .env.production exists
    if [ ! -f ".env.production" ]; then
        echo -e "${RED}❌ .env.production file not found!${NC}"
        echo "Please create .env.production with your production credentials"
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker is not installed!${NC}"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}❌ Docker Compose is not installed!${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Prerequisites check passed${NC}"
}

# Function to build locally
build_local() {
    echo -e "${YELLOW}🔨 Building application locally...${NC}"
    
    # Build frontend
    npm run build
    
    # Build Docker images
    docker-compose build
    
    echo -e "${GREEN}✅ Build complete${NC}"
}

# Function to deploy to server
deploy_to_server() {
    echo -e "${YELLOW}📦 Deploying to server ${SERVER_IP}...${NC}"
    
    # Create deployment directory on server
    ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p ${DEPLOY_PATH}"
    
    # Copy files to server
    echo "Copying files..."
    rsync -avz --exclude 'node_modules' \
               --exclude '.git' \
               --exclude '.env.local' \
               --exclude 'dist' \
               --exclude '.DS_Store' \
               ./ ${SERVER_USER}@${SERVER_IP}:${DEPLOY_PATH}/
    
    # Copy .env.production separately
    scp .env.production ${SERVER_USER}@${SERVER_IP}:${DEPLOY_PATH}/.env.production
    
    echo -e "${GREEN}✅ Files copied to server${NC}"
}

# Function to start services on server
start_services() {
    echo -e "${YELLOW}🚀 Starting services on server...${NC}"
    
    ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
        cd /var/www/twenty-phone-widget
        
        # Stop existing containers
        docker-compose down
        
        # Pull latest images
        docker-compose pull
        
        # Build and start containers
        docker-compose up -d --build
        
        # Show container status
        docker-compose ps
        
        # Show logs
        docker-compose logs --tail=50
ENDSSH
    
    echo -e "${GREEN}✅ Services started${NC}"
}

# Function to setup nginx (if needed)
setup_nginx() {
    echo -e "${YELLOW}🌐 Setting up Nginx...${NC}"
    
    ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
        # Create Nginx config
        cat > /etc/nginx/sites-available/twenty-phone-widget << 'EOF'
server {
    listen 80;
    server_name widget.autoformai.fr;
    
    # Frontend
    location / {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Token Server API
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF
        
        # Enable site
        ln -sf /etc/nginx/sites-available/twenty-phone-widget /etc/nginx/sites-enabled/
        
        # Test and reload nginx
        nginx -t && systemctl reload nginx
ENDSSH
    
    echo -e "${GREEN}✅ Nginx configured${NC}"
}

# Main deployment flow
main() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Twenty Phone Widget Deployment${NC}"
    echo -e "${GREEN}  Environment: ${ENVIRONMENT}${NC}"
    echo -e "${GREEN}========================================${NC}"
    
    check_prerequisites
    build_local
    deploy_to_server
    start_services
    
    if [ "$2" == "--nginx" ]; then
        setup_nginx
    fi
    
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}🎉 Deployment complete!${NC}"
    echo -e "${GREEN}Widget URL: http://${SERVER_IP}:3003${NC}"
    echo -e "${GREEN}Token Server: http://${SERVER_IP}:3001${NC}"
    echo -e "${GREEN}========================================${NC}"
}

# Run main function
main "$@"