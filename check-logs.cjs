const { NodeSSH } = require('node-ssh');

async function checkLogs() {
  const ssh = new NodeSSH();
  await ssh.connect({
    host: '160.187.68.243',
    username: 'root',
    password: 'Bm0y431YQKrf6iI'
  });

  const result = await ssh.execCommand('pm2 logs dpinside-api --lines 20 --nostream');
  console.log('PM2 Logs:\n', result.stdout, result.stderr);

  ssh.dispose();
}

checkLogs();
