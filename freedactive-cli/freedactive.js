const fs = require('fs');
const zlib = require('zlib');
const tar = require('tar');
const client = require('https');
const args = process.argv.slice(2);

const generateCode = function(dir) {
     
    const options = {
        hostname: 'steven-freed.github.io',
        path: '/freedactive/cli/hello-world.tar.gz',
        method: 'GET',
        headers: { 'Accept-Encoding': 'gzip' }
    };

    const req = client.request(options, function(res) {
        res.on('end', function() {}).pipe(zlib.createUnzip()).pipe(tar.extract()).on('end', function() {
            fs.renameSync('./hello-world/', dir, function() {});
        });
    });
    
    req.on('error', function(err) {
        throw new Error(err);
    });

    req.end();
};

const createApp = function() {
    try {
        const dir = args[1]; 
        if (!fs.existsSync(dir))
            generateCode(dir);
        else
            throw new Error('Project already exists');
    } catch(e) {
        throw new Error('Expected project name followed by -c flag');
    }
};

switch(args[0]) {
    case '-c':
        createApp();
        break;
    default:
        break;
};

