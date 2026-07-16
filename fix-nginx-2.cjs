const { NodeSSH } = require('node-ssh');

async function fixDefaultNginx() {
  const ssh = new NodeSSH();
  await ssh.connect({ host: '160.187.68.243', username: 'root', password: 'Bm0y431YQKrf6iI' });
  
  // Disable default site config and rename server_name in ours to catch IP
  await ssh.execCommand('mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bak || true');
  
  const nginxConf = `server {
    listen 80 default_server;
    server_name 160.187.68.243 _;
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

  await ssh.execCommand(`echo '${nginxConf}' > /etc/nginx/conf.d/dpinside.conf`);
  
  // Use sed to comment out the default server block in nginx.conf if it exists
  await ssh.execCommand("sed -i -e '/server {/,/}/ s/^/#/' /etc/nginx/nginx.conf");
  
  const test = await ssh.execCommand('nginx -t && systemctl restart nginx');
  console.log(test.stdout, test.stderr);
  ssh.dispose();
}
fixDefaultNginx();
