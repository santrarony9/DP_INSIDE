const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');

const nginxConf = `server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`;

fs.writeFileSync(path.join(__dirname, 'temp-nginx.conf'), nginxConf);

async function fixNginx() {
  const ssh = new NodeSSH();
  await ssh.connect({ host: '160.187.68.243', username: 'root', password: 'Bm0y431YQKrf6iI' });
  await ssh.putFile(path.join(__dirname, 'temp-nginx.conf'), '/etc/nginx/conf.d/dpinside-api.conf');
  const test = await ssh.execCommand('nginx -t && systemctl reload nginx');
  console.log(test.stdout, test.stderr);
  ssh.dispose();
}

fixNginx();
