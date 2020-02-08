var fs = require('fs');
var uglify = require('uglify-js');

var code = {
    './lib/freedactive.js': null
};

Object.keys(code).map(function(file) {
    var content = fs.readFileSync(file, 'utf8');
    code[file] = content.slice(0, content.indexOf('global.'));
});

var minicode = uglify.minify(code);
fs.writeFileSync('./dist/freedactive.min.js', minicode.code);