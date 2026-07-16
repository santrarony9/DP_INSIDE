const { NodeSSH } = require('node-ssh');
const path = require('path');
const fs = require('fs');

const ssh = new NodeSSH();

async function deploy() {
  console.log('⏳ [1/5] Connecting to HostGraber AlmaLinux VPS (160.187.68.243)...');
  
  await ssh.connect({
    host: '160.187.68.243',
    username: 'root',
    password: 'Bm0y431YQKrf6iI'
  });

  console.log('✅ Connected via SSH!');
  console.log('⏳ [2/5] Creating application directories on VPS (/opt/dpinside/DP_INSIDE)...');
  
  await ssh.execCommand('mkdir -p /opt/dpinside/DP_INSIDE/server');

  console.log('⏳ [3/5] Uploading server files & setup script to VPS via SFTP...');
  
  const localRoot = path.resolve(__dirname);
  const remoteRoot = '/opt/dpinside/DP_INSIDE';

  // Upload setup-vps.sh and top level files
  await ssh.putFile(path.join(localRoot, 'setup-vps.sh'), `${remoteRoot}/setup-vps.sh`);
  await ssh.execCommand('chmod +x /opt/dpinside/DP_INSIDE/setup-vps.sh');

  const uploadDirRecursive = async (localPath, remotePath) => {
    const items = fs.readdirSync(localPath);
    await ssh.execCommand(`mkdir -p "${remotePath}"`);
    for (const item of items) {
      if (item === 'node_modules' || item.startsWith('.') || item === 'dist') continue;
      const fullLocal = path.join(localPath, item);
      const fullRemote = `${remotePath}/${item}`;
      if (fs.statSync(fullLocal).isDirectory()) {
        await uploadDirRecursive(fullLocal, fullRemote);
      } else {
        await ssh.putFile(fullLocal, fullRemote);
      }
    }
  };

  await uploadDirRecursive(path.join(localRoot, 'server'), `${remoteRoot}/server`);
  await uploadDirRecursive(path.join(localRoot, 'src'), `${remoteRoot}/src`);
  await uploadDirRecursive(path.join(localRoot, 'public'), `${remoteRoot}/public`);
  await uploadDirRecursive(path.join(localRoot, 'tracker'), `${remoteRoot}/tracker`);

  const topFiles = ['package.json', 'package-lock.json', 'index.html', 'vite.config.ts', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json', 'README.md', 'OPEN_STUDIO_OS.bat'];
  for (const f of topFiles) {
    if (fs.existsSync(path.join(localRoot, f))) {
      await ssh.putFile(path.join(localRoot, f), `${remoteRoot}/${f}`);
    }
  }
  console.log('✅ All project & server files uploaded successfully!');

  console.log('⏳ [4/5] Executing setup-vps.sh on VPS (Installing MongoDB 7.0, Node.js 20, PM2, Nginx)...');
  console.log('----------------------------------------------------------------------------');
  
  const result = await ssh.execCommand('/opt/dpinside/DP_INSIDE/setup-vps.sh', {
    onStdout(chunk) {
      process.stdout.write(chunk.toString('utf8'));
    },
    onStderr(chunk) {
      process.stderr.write(chunk.toString('utf8'));
    }
  });

  console.log('----------------------------------------------------------------------------');
  console.log('⏳ [5/5] Verifying live API endpoints on VPS...');
  const healthCheck = await ssh.execCommand('curl -s http://127.0.0.1:4000/health || echo "FAIL"');
  console.log('API Health Check Output:', healthCheck.stdout);

  ssh.dispose();
  console.log('🎉 VPS DEPLOYMENT COMPLETED 100% AUTOMATICALLY!');
}

deploy().catch(err => {
  console.error('❌ Deployment Error:', err);
  process.exit(1);
});
