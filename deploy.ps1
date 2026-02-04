# Backend Cristalex Dent - Deploy Script for Windows
# Server: 195.178.106.164

Write-Host "🚀 Starting Backend Deploy to Production Server..." -ForegroundColor Green

$SERVER_IP = "195.178.106.164"
$SERVER_USER = "root"
$PROJECT_NAME = "backend-cristalex-dent"

# Instructions for manual deploy
Write-Host "`n📋 Deploy Instructions:" -ForegroundColor Yellow
Write-Host "1. Connect to server via SSH:"
Write-Host "   ssh root@195.178.106.164" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Run these commands on the server:" -ForegroundColor Yellow
Write-Host @"
# Create project directory
mkdir -p /var/www/backend-cristalex-dent
cd /var/www/backend-cristalex-dent

# Clone repository (if not done)
git clone https://github.com/iShunea/backend-cristalex-dent.git .

# Or pull latest changes
git pull origin main

# Install dependencies
npm install --production

# Create .env file
cat > .env << 'EOF'
SERVER_PORT=4050
NODE_ENV=production
MONGO_DB=mongodb+srv://cristalexdent23_db_user:XrIeWquzb0hXyEKx@cluster0.slkkck9.mongodb.net/?appName=Cluster0
JWT_SECRET=cristalex-dent-secret-key-2024
CLOUDFLARE_R2_ACCOUNT_ID=77924fd9b0f9859ededf3e0c25277d36
CLOUDFLARE_R2_ACCESS_KEY_ID=5497d670086046b220bb83f5972223d9
CLOUDFLARE_R2_SECRET_ACCESS_KEY=137b5a458ffd8548c6e35d20487084c238050372294dcf9491dc8c54fbb8dadc
R2_BUCKET_NAME=website-cristalex
R2_PUBLIC_URL=https://pub-da922ed988b345b1b14ddd6fd7ac4267.r2.dev
AWS_ACCESS_KEY_ID=5497d670086046b220bb83f5972223d9
AWS_SECRET_ACCESS_KEY=137b5a458ffd8548c6e35d20487084c238050372294dcf9491dc8c54fbb8dadc
AWS_REGION=auto
S3_BUCKET=website-cristalex
EMAIL_HOST=mail.ishunea.io
EMAIL_PORT=465
EMAIL_USER=cristalexdent@ishunea.io
EMAIL_PASSWORD=%8XLbxI`$ns.l
EOF

# Install PM2 globally
npm install -g pm2

# Stop and delete existing process
pm2 stop backend-cristalex-dent
pm2 delete backend-cristalex-dent

# Start with PM2
pm2 start server.js --name backend-cristalex-dent
pm2 save
pm2 startup

# View logs
pm2 logs backend-cristalex-dent --lines 50
"@ -ForegroundColor Cyan

Write-Host "`n✅ Copy the commands above and run them on the server!" -ForegroundColor Green
Write-Host "`n🌐 Backend will be available at: http://195.178.106.164:4050" -ForegroundColor Green
Write-Host "🏥 Health check: http://195.178.106.164:4050/api/health" -ForegroundColor Green
