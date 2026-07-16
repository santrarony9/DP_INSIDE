const { NodeSSH } = require('node-ssh');
const path = require('path');

async function reseed() {
  const ssh = new NodeSSH();
  await ssh.connect({
    host: '160.187.68.243',
    username: 'root',
    password: 'Bm0y431YQKrf6iI'
  });

  console.log('Uploading new seed.js to VPS...');
  await ssh.putFile(path.join(__dirname, 'server', 'seed.js'), '/opt/dpinside/DP_INSIDE/server/seed.js');
  
  console.log('Running node seed.js on VPS...');
  const result = await ssh.execCommand('node seed.js', { cwd: '/opt/dpinside/DP_INSIDE/server' });
  console.log('Seed Result:', result.stdout, result.stderr);

  ssh.dispose();
}
reseed();
