#!/bin/bash
# ============================================================================
#  DP INSIDE StudioOS — ONE-CLICK VPS SETUP SCRIPT
#  Target: AlmaLinux 9.7 / RHEL 9 / CentOS Stream 9
#  This script installs: MongoDB 7.0, Node.js 20, PM2, Nginx
#  Then deploys the API server and seeds the database
# ============================================================================

set -e  # Exit on any error

echo ""
echo "============================================================================"
echo "  🎬 DP INSIDE StudioOS — VPS AUTO-SETUP"
echo "  Target: AlmaLinux 9.7 | MongoDB 7.0 | Node.js 20 | PM2 | Nginx"
echo "============================================================================"
echo ""

# ---------------------------------------------------
# STEP 1: INSTALL MONGODB 7.0
# ---------------------------------------------------
echo "[1/7] Installing MongoDB 7.0..."

cat > /etc/yum.repos.d/mongodb-org-7.0.repo << 'EOF'
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/9/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://pgp.mongodb.com/server-7.0.asc
EOF

dnf install -y mongodb-org > /dev/null 2>&1
systemctl start mongod
systemctl enable mongod
echo "   ✅ MongoDB 7.0 installed and running."

# ---------------------------------------------------
# STEP 2: INSTALL NODE.JS 20 LTS
# ---------------------------------------------------
echo "[2/7] Installing Node.js 20 LTS..."

dnf module reset nodejs -y > /dev/null 2>&1 || true
dnf module enable nodejs:20 -y > /dev/null 2>&1
dnf install -y nodejs > /dev/null 2>&1
npm install -g pm2 > /dev/null 2>&1
echo "   ✅ Node.js $(node -v) and PM2 installed."

# ---------------------------------------------------
# STEP 3: INSTALL NGINX
# ---------------------------------------------------
echo "[3/7] Installing Nginx..."

dnf install -y nginx > /dev/null 2>&1
systemctl start nginx
systemctl enable nginx
echo "   ✅ Nginx installed and running."

# ---------------------------------------------------
# STEP 4: CLONE REPO & INSTALL DEPENDENCIES
# ---------------------------------------------------
echo "[4/7] Cloning repository and installing dependencies..."

APP_DIR="/opt/dpinside"
mkdir -p $APP_DIR

if [ -d "$APP_DIR/DP_INSIDE" ]; then
    cd "$APP_DIR/DP_INSIDE"
    git pull origin main
else
    cd $APP_DIR
    git clone https://github.com/santrarony9/DP_INSIDE.git
    cd "$APP_DIR/DP_INSIDE"
fi

cd server
npm install > /dev/null 2>&1
echo "   ✅ Dependencies installed."

# ---------------------------------------------------
# STEP 5: CONFIGURE ENVIRONMENT
# ---------------------------------------------------
echo "[5/7] Configuring environment..."

# Generate a random JWT secret for production
JWT_SECRET=$(openssl rand -base64 32)

cat > .env << ENVEOF
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/dpinside
JWT_SECRET=${JWT_SECRET}
NODE_ENV=production
ENVEOF

echo "   ✅ Environment configured with secure JWT secret."

# ---------------------------------------------------
# STEP 6: SEED DATABASE WITH INITIAL DATA
# ---------------------------------------------------
echo "[6/7] Seeding MongoDB with initial studio data..."

node seed.js
echo "   ✅ Database seeded with team, clients, jobs, and social posts."

# ---------------------------------------------------
# STEP 7: CONFIGURE NGINX REVERSE PROXY
# ---------------------------------------------------
echo "[7/7] Configuring Nginx reverse proxy..."

VPS_IP=$(hostname -I | awk '{print $1}')

cat > /etc/nginx/conf.d/dpinside-api.conf << 'NGINXEOF'
server {
    listen 80;
    server_name _;

    # API Backend
    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }

    # Health check
    location /health {
        proxy_pass http://127.0.0.1:4000/health;
    }
}
NGINXEOF

# Remove default nginx page if it conflicts
rm -f /etc/nginx/conf.d/default.conf 2>/dev/null || true

# Test and reload nginx
nginx -t && systemctl reload nginx
echo "   ✅ Nginx reverse proxy configured."

# ---------------------------------------------------
# OPEN FIREWALL
# ---------------------------------------------------
echo "Opening firewall ports..."

firewall-cmd --permanent --add-service=http > /dev/null 2>&1 || true
firewall-cmd --permanent --add-service=https > /dev/null 2>&1 || true
firewall-cmd --permanent --add-port=4000/tcp > /dev/null 2>&1 || true
firewall-cmd --reload > /dev/null 2>&1 || true
echo "   ✅ Firewall configured (HTTP, HTTPS, port 4000)."

# ---------------------------------------------------
# START API SERVER WITH PM2
# ---------------------------------------------------
echo "Starting API server with PM2..."

cd "$APP_DIR/DP_INSIDE/server"
pm2 delete dpinside-api 2>/dev/null || true
pm2 start index.js --name dpinside-api --env production
pm2 save
pm2 startup systemd -u root --hp /root > /dev/null 2>&1 || true

echo ""
echo "============================================================================"
echo "  🎉 SETUP COMPLETE! YOUR STUDIOOS API IS LIVE!"
echo "============================================================================"
echo ""
echo "  📡 API Server:    http://${VPS_IP}:4000"
echo "  📡 Via Nginx:     http://${VPS_IP}/api/"
echo "  🗄️  MongoDB:       mongodb://127.0.0.1:27017/dpinside"
echo ""
echo "  Test it now:"
echo "    curl http://${VPS_IP}:4000/health"
echo "    curl http://${VPS_IP}:4000/api/team"
echo ""
echo "  PM2 Commands:"
echo "    pm2 status          - Check if API is running"
echo "    pm2 logs            - View live API logs"
echo "    pm2 restart all     - Restart API server"
echo ""
echo "============================================================================"
