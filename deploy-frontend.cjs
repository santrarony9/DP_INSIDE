const { NodeSSH } = require('node-ssh');
const path = require('path');
const fs = require('fs');

async function deployFrontend() {
  const ssh = new NodeSSH();
  console.log('⏳ Connecting to VPS for Frontend Deployment...');
  await ssh.connect({
    host: '160.187.68.243',
    username: 'root',
    password: 'Bm0y431YQKrf6iI'
  });

  const localDist = path.join(__dirname, 'dist');
  const remoteWebRoot = '/usr/share/nginx/html';

  console.log('⏳ Uploading React frontend (dist/) to Nginx...');
  const uploadDirRecursive = async (localPath, remotePath) => {
    const items = fs.readdirSync(localPath);
    await ssh.execCommand(`mkdir -p "${remotePath}"`);
    for (const item of items) {
      const fullLocal = path.join(localPath, item);
      const fullRemote = `${remotePath}/${item}`;
      if (fs.statSync(fullLocal).isDirectory()) {
        await uploadDirRecursive(fullLocal, fullRemote);
      } else {
        await ssh.putFile(fullLocal, fullRemote);
      }
    }
  };

  // Clear old nginx files and upload new React app
  await ssh.execCommand(`rm -rf ${remoteWebRoot}/*`);
  await uploadDirRecursive(localDist, remoteWebRoot);
  console.log('✅ React frontend uploaded!');

  console.log('⏳ Updating Nginx configuration for React Router...');
  const nginxConf = `
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Serve static frontend files (React Router fallback)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Node.js backend
    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
`;
  
  await ssh.execCommand(`echo "${nginxConf}" > /etc/nginx/conf.d/dpinside-api.conf`);
  const nginxTest = await ssh.execCommand('nginx -t && systemctl reload nginx');
  console.log('Nginx Reload:', nginxTest.stdout, nginxTest.stderr);

  ssh.dispose();
  console.log('🎉 STUDIO_OS V2 IS NOW FULLY LIVE ON THE INTERNET!');
}

deployFrontend();
