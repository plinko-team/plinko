import localtunnel from 'localtunnel';

function startLocalTunnel() {
  const tunnel = localtunnel(3000, {subdomain: 'radioactive-kittens'}, (err, tunnel) => {
    console.log(tunnel.url);
  })

  tunnel.on('close', function() {
    console.log('tunnel closed :(');
  });
}

export default startLocalTunnel;
