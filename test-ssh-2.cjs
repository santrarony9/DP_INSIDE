const { NodeSSH } = require('node-ssh');

const passwords = [
  'BmOy431YQKrf6il',
  'Bm0y431YQKrf6il',
  'BmOy431YQKrf6iI',
  'Bm0y431YQKrf6iI',
  'BmOy431YQKrf6i1',
  'Bm0y431YQKrf6i1',
  'BmOy43lYQKrf6il',
  'Bm0y43lYQKrf6il'
];

async function testAuth(pwd) {
  const ssh = new NodeSSH();
  try {
    await ssh.connect({
      host: '160.187.68.243',
      username: 'root',
      password: pwd,
      readyTimeout: 5000,
      tryKeyboard: true
    });
    console.log('🎉 SUCCESS! Correct password is:', pwd);
    ssh.dispose();
    return true;
  } catch {
    return false;
  }
}

async function run() {
  console.log('Testing passwords...');
  for (const pwd of passwords) {
    if (await testAuth(pwd)) return;
  }
  console.log('❌ All tested passwords failed.');
}
run();
