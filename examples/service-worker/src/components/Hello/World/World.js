World.prototype = new Component;
    
function World() {
    
}

World.prototype.markup = function() {
    return ('\
        <div id="world">\
            <button id="message" onclick="changeColor()">World!</button>\
        </div>\
    ');
}

World.prototype.changeColor = function() {
    if (document.getElementById('message').style.color === 'red') {
        document.getElementById('message').style.color = 'white';
    } else {
        document.getElementById('message').style.color = 'red';
    }
}