#!/usr/bin/env node

const colors = require('colors');
const fs = require('fs');
const zlib = require('zlib');
const tar = require('tar');
const client = require('https');
const serve = require('./dev-server');

const HOST = 'steven-freed.github.io';
const PATH = '/freedactive/cli/hello-world.tar.gz';
const CREATE = colors.rainbow('THANK YOU ') +
                colors.magenta('for choosing') +
                colors.rainbow(' Freedactive! ') + 
                '🤙\n' +
                colors.magenta('Get started by looking at our documentation ') +
                colors.magenta('https://github.com/steven-freed/freedactive/tree/master/README.md\n') +
                colors.red('OR\n') +
                colors.magenta('Some examples ') +
                colors.magenta('https://github.com/steven-freed/freedactive/tree/master/examples');
const COMPONENT = (name) => colors.america(`Component ${name} has been created!`);

const generateProject = function(dir, callback) {

    if(fs.existsSync(dir))
        return callback(new Error('Project already exists'));
     
    const options = {
        hostname: HOST,
        path: PATH,
        method: 'GET',
        headers: { 'Accept-Encoding': 'gzip' }
    };

    client.request(options, (res) => {
        res
        .pipe(zlib.createGunzip())
        .pipe(tar.extract())
        .on('end', () => {
            rename(dir)
            .then(console.log(CREATE))
            .catch((err) => callback(err));    
        })
    })
    .on('error', () => callback(new Error('Network error obtaining boilerplate code from Freedactive')))
    .end();

};

const rename = function(dir) {
    return new Promise(function(resolve, reject) {
        try {
            const oldIndex = 'hello-world/index.html';
            const oldDir = 'hello-world/';
            let buf = fs.readFileSync(oldIndex, 'utf8');
            buf = buf.replace(/<title>(.*?)<\/title>/g, '<title>' + dir + '</title>');
            fs.writeFileSync(oldIndex, buf, 'utf8');
            fs.renameSync(oldDir, dir);
            resolve();
        } catch {
            reject('Opps Something went wrong 😬');
        }
    });
};

const generateComponent = function(name, callback) {
    const identifier = name.toLowerCase().replace(" ", "-");
    name = name.replace(" ", "");
    const componentJs = `${name}.prototype = new Component;\n` +
    `function ${name}() {\n` + 
    `\tthis.markup = ('\\\n\t\t<div id="${identifier}">\\\n\t\t\t<h1>${name} Component</h1>\\\n\t\t</div>\\\n\t');\n` +
    `\tthis.style = './src/components/${name}/${name}.css';\n` +
    `\tthis.children = [\n\t\t// components being used in your component\n\t];\n}`
    const componentCss = `#${identifier} {\n\ttext-align: center;\n\tdisplay: inline-block;\n}`;
    fs.writeFileSync(`${name}.js`, componentJs);
    fs.writeFileSync(`${name}.css`, componentCss);
    callback(COMPONENT(name));
};

const createApp = function(dir, callback) {
    if(!dir)
        return callback(new Error('The "create" command should be followed by your projects name'));
    
    generateProject(dir, (err) => err ? console.log(colors.red(err)) : null);
};

const createComponent = function(name, callback) {
    if(!name)
        return callback(new Error('No component name specified'));
    else 
        generateComponent(name, (res) => console.log(res));
};

switch(process.argv[2]) {
    case 'create':
        createApp(process.argv[3], (err) => err ? console.log(colors.red(err)) : null);
        break;
    case 'serve':
        if(process.argv[3] === '-p' && process.argv[4])
            serve(parseInt(process.argv[4]));
        else
            serve();
        break;
    case 'component':
        createComponent(process.argv[3], (err) => err ? console.log(colors.red(err)) : null);
        break;
    default:
        break;
};
