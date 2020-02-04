var World = function World() {
};

World.prototype = Object.create(Component.prototype);

World.prototype.getMarkup = function() {
    return ('\
        <div id="world">\
            <h1>World!</h1>\
        </div>\
    ');
}

World.prototype.getStyle = function() {
    return './src/components/Hello/World/World.css';
}