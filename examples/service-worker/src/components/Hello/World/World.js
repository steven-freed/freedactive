World.prototype = new Component;
    
function World() {
    this.markup = ('\
        <div id="world">\
            <h1>World!</h1>\
        </div>\
    ');

    this.style = './src/components/Hello/World/World.css';
}