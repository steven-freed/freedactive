const fs = require('fs');
const uglify = require('uglify-js');

const code = {
    './lib/freedactive.js': null
};

for (key in code) {
    const fileType = key.slice(key.lastIndexOf('.') + 1);
    let content = fs.readFileSync(key, 'utf8');
    code[key] = content.slice(0, content.indexOf('global.'));
    let newFile = './dist' + key.slice(key.lastIndexOf('/'), key.lastIndexOf('.')) +
    '.min' + key.slice(key.lastIndexOf('.'));

    let minicode;
    if (fileType === 'js') {
        minicode = uglify.minify(code[key], { mangle: false });
    } 
    fs.writeFileSync(newFile, minicode.code ? minicode.code : minicode);
}