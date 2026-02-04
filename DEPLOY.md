# 🚀 Deployment Guide - Backend Cristalex Dent

## Server Information
- **IP Address:** 195.178.106.164
- **Username:** root
- **Password:** cristalexDent2008
- **OS:** Ubuntu 22.04 NodeJS

## Quick Deploy

### Option 1: Automatic Deploy (from Windows)
```powershell
.\deploy.ps1
```

### Option 2: Manual Deploy

#### Step 1: Connect to Server
```bash
ssh root@195.178.106.164
# Password: cristalexDent2008
```

#### Step 2: Setup Project
```bash
# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Create project directory
mkdir -p /var/www/backend-cristalex-dent
cd /var/www/backend-cristalex-dent

# Clone repository
git clone https://github.com/iShunea/backend-cristalex-dent.git .

# Install dependencies
npm install --production
```

#### Step 3: Configure Environment
```bash
# Create .env file
nano .env
```

Paste this content:
```env
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
EMAIL_PASSWORD=%8XLbxI$ns.l
```

Save: `Ctrl+X`, then `Y`, then `Enter`

#### Step 4: Start with PM2
```bash
# Start the application
pm2 start server.js --name backend-cristalex-dent

# Save PM2 configuration
pm2 save

# Setup auto-start on reboot
pm2 startup
# Run the command that PM2 outputs

# View logs
pm2 logs backend-cristalex-dent
```

## 📡 Access URLs

- **API Base:** http://195.178.106.164:4050
- **Health Check:** http://195.178.106.164:4050/api/health
- **Services:** http://195.178.106.164:4050/api/services
- **Team Members:** http://195.178.106.164:4050/api/team-members

## 🔧 PM2 Commands

```bash
# View all processes
pm2 list

# View logs
pm2 logs backend-cristalex-dent

# Restart application
pm2 restart backend-cristalex-dent

# Stop application
pm2 stop backend-cristalex-dent

# Delete process
pm2 delete backend-cristalex-dent

# Monitor
pm2 monit
```

## 🔄 Update Deployment

To update with latest changes:

```bash
cd /var/www/backend-cristalex-dent
git pull origin main
npm install --production
pm2 restart backend-cristalex-dent
```

## 🔥 Firewall Configuration

If port 4050 is not accessible, open it:

```bash
# For UFW
sudo ufw allow 4050/tcp
sudo ufw reload

# For iptables
sudo iptables -A INPUT -p tcp --dport 4050 -j ACCEPT
sudo iptables-save
```

## 🆘 Troubleshooting

### Check if backend is running
```bash
pm2 list
pm2 logs backend-cristalex-dent --lines 50
```

### Check if port is listening
```bash
netstat -tulpn | grep 4050
# or
lsof -i :4050
```

### Restart backend
```bash
pm2 restart backend-cristalex-dent
```

### View full logs
```bash
pm2 logs backend-cristalex-dent --lines 200
```

### Check MongoDB connection
```bash
pm2 logs backend-cristalex-dent | grep -i mongo
```

## 📊 Monitoring

View real-time monitoring:
```bash
pm2 monit
```

View resource usage:
```bash
pm2 show backend-cristalex-dent
```

## 🔐 Security Notes

- Environment variables are stored in `/var/www/backend-cristalex-dent/.env`
- Never commit `.env` to git
- Keep credentials secure
- Use firewall to restrict access if needed
