const { spawn } = require('child_process');
const path = require('path');

const ghPath = path.join(__dirname, 'gh-cli', 'bin', 'gh.exe');
const child = spawn(ghPath, ['auth', 'login', '-h', 'github.com', '-p', 'https', '-w'], {
  env: { ...process.env, GH_FORCE_TTY: '100%'}
});

child.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output);
  if (output.includes('First copy your one-time code:')) {
    // Keep it running!
  }
});

child.stderr.on('data', (data) => {
  console.error(data.toString());
});
