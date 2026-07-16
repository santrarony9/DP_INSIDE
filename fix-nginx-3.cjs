const { NodeSSH } = require('node-ssh');

const cleanNginxConf = `user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 4096;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    include /etc/nginx/conf.d/*.conf;
}
`;

async function fixNginxClean() {
  const ssh = new NodeSSH();
  await ssh.connect({ host: '160.187.68.243', username: 'root', password: 'Bm0y431YQKrf6iI' });
  
  await ssh.execCommand(`echo '${cleanNginxConf}' > /etc/nginx/nginx.conf`);
  const test = await ssh.execCommand('nginx -t && systemctl restart nginx');
  console.log(test.stdout, test.stderr);
  
  const curl = await ssh.execCommand('curl -s -I http://127.0.0.1');
  console.log("CURL:", curl.stdout);
  
  ssh.dispose();
}
fixNginxClean();
