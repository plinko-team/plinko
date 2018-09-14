const { exec } = require('child_process');

const onReload = () => {
	exec('pm2 reload all', (err, stdout, stderr) => {
		if (err) console.log(err);

		console.log(stdout);
		console.log(stderr);
	})
}

setTimeout(onReload, 10800000);

