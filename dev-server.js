var express = require('express');
var app = express();

var path = __dirname + '/';
var port = 8080;

// serves index.html file no matter what route
// for static files
app.use(express.static(path));
app.get('*', function(req, res) {
    res.sendFile(path + '/index.html');
});
app.listen(port);