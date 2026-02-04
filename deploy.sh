#!/bin/bash

# Backend Cristalex Dent - Deploy Script
# Server: 195.178.106.164

echo "🚀 Starting Backend Deploy to Production Server..."

# Configuration
SERVER_IP="195.178.106.164"
SERVER_USER="root"
PROJECT_NAME="backend-cristalex-dent"
REMOTE_DIR="/var/www/$PROJECT_NAME"
PORT=4050

echo "📦 Installing dependencies locally..."
npm install

echo "📤 Uploading files to server..."
# Create directory on server
ssh $SERVER_USER@$SERVER_IP "mkdir -p $REMOTE_DIR"

# Sync files (excluding node_modules and .env)
rsync -avz --exclude 'node_modules' \
           --exclude '.env' \
           --exclude '.git' \
           --exclude 'images' \
           --exclude '.claude' \
           --exclude 'nul' \
           ./ $SERVER_USER@$SERVER_IP:$REMOTE_DIR/

echo "🔧 Installing dependencies on server..."
ssh $SERVER_USER@$SERVER_IP << 'ENDSSH'
cd /var/www/backend-cristalex-dent

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

# Install dependencies
npm install --production

echo "Creating .env file..."
cat > .env << 'EOF'
# Server Configuration
SERVER_PORT=4050
NODE_ENV=production

# MongoDB Configuration
MONGO_DB=mongodb+srv://cristalexdent23_db_user:XrIeWquzb0hXyEKx@cluster0.slkkck9.mongodb.net/?appName=Cluster0

# JWT Secret
JWT_SECRET=cristalex-dent-secret-key-2024

# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCOUNT_ID=77924fd9b0f9859ededf3e0c25277d36
CLOUDFLARE_R2_ACCESS_KEY_ID=5497d670086046b220bb83f5972223d9
CLOUDFLARE_R2_SECRET_ACCESS_KEY=137b5a458ffd8548c6e35d20487084c238050372294dcf9491dc8c54fbb8dadc
R2_BUCKET_NAME=website-cristalex
R2_PUBLIC_URL=https://pub-da922ed988b345b1b14ddd6fd7ac4267.r2.dev

# AWS S3 Compatible (for R2)
AWS_ACCESS_KEY_ID=5497d670086046b220bb83f5972223d9
AWS_SECRET_ACCESS_KEY=137b5a458ffd8548c6e35d20487084c238050372294dcf9491dc8c54fbb8dadc
AWS_REGION=auto
S3_BUCKET=website-cristalex

# Email Configuration
EMAIL_HOST=mail.ishunea.io
EMAIL_PORT=465
EMAIL_USER=cristalexdent@ishunea.io
EMAIL_PASSWORD=%8XLbxI$ns.l
EOF

# Stop existing PM2 process if running
pm2 stop backend-cristalex-dent 2>/dev/null || true
pm2 delete backend-cristalex-dent 2>/dev/null || true

# Start with PM2
pm2 start server.js --name backend-cristalex-dent --time
pm2 save
pm2 startup systemd -u root --hp /root

echo "✅ Backend deployed successfully!"
pm2 list
pm2 logs backend-cristalex-dent --lines 20

ENDSSH

echo "🎉 Deploy completed!"
echo "Backend running at: http://195.178.106.164:4050"
echo "Health check: http://195.178.106.164:4050/api/health"
echo ""
echo "To view logs: ssh root@195.178.106.164 'pm2 logs backend-cristalex-dent'"
echo "To restart: ssh root@195.178.106.164 'pm2 restart backend-cristalex-dent'"
