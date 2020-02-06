var express = require('express');
var colors = require('colors');
var app = express();

var path = process.cwd();

// serves index.html file no matter what route
// for static files
app.use(express.static(path));
app.get('*', function(req, res) {
    res.sendFile(path + '/index.html');
});

const serve = function(port=8080) {
    app.listen(port);
    console.log(colors.magenta('Freedactive is serving your app at http://localhost:' + port + "/") + ' 🤙');
}

module.exports = serve;