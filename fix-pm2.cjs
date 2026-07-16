const { NodeSSH } = require('node-ssh');

async function fixPM2() {
  const ssh = new NodeSSH();
  await ssh.connect({
    host: '160.187.68.243',
    username: 'root',
    password: 'Bm0y431YQKrf6iI'
  });

  console.log('Fixing PM2 path on VPS...');
  const result = await ssh.execCommand('cd /opt/dpinside/DP_INSIDE/server && pm2 start index.js --name dpinside-api --env production && pm2 save');
  console.log('PM2 Result:', result.stdout, result.stderr);

  console.log('Verifying API...');
  const healthCheck = await ssh.execCommand('curl -s http://127.0.0.1:4000/api/team || echo "FAIL"');
  console.log('API Output (Team endpoint):', healthCheck.stdout.substring(0, 200) + '...');

  ssh.dispose();
}

fixPM2();
