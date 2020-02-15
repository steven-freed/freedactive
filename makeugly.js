var fs = require('fs');
var uglify = require('uglify-js');
//var uglifycss = require('uglifycss');

var code = {
    './lib/freedactive.js': null
    //'./lib/fa-ui.js': null,
    //'./lib/fa-ui.css': null
};

for (key in code) {
    var fileType = key.slice(key.lastIndexOf('.') + 1);
    var content = fs.readFileSync(key, 'utf8');
    code[key] = content.slice(0, content.indexOf('global.'));
    var newFile = './dist' + key.slice(key.lastIndexOf('/'), key.lastIndexOf('.')) +
    '.min' + key.slice(key.lastIndexOf('.'));

    var minicode;
    if (fileType === 'js') {
        minicode = uglify.minify(code[key]);
    } 
    fs.writeFileSync(newFile, minicode.code ? minicode.code : minicode);
}