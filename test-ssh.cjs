const { NodeSSH } = require('node-ssh');

async function testAuth(pwd) {
  const ssh = new NodeSSH();
  try {
    console.log('Testing password:', pwd);
    await ssh.connect({
      host: '160.187.68.243',
      username: 'root',
      password: pwd,
      tryKeyboard: true,
      onKeyboardInteractive: (name, instructions, instructionsLang, prompts, finish) => {
        finish([pwd]);
      }
    });
    console.log('SUCCESS with password:', pwd);
    ssh.dispose();
    return true;
  } catch (err) {
    console.log('FAILED with password:', pwd, err.message);
    return false;
  }
}

async function run() {
  if (await testAuth('BmOy431YQKrf6il')) return; // Capital O
  if (await testAuth('Bm0y431YQKrf6il')) return; // Zero 0
}
run();
