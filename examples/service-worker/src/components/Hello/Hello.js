var Hello = function Hello() {
}

Hello.prototype = Object.create(Component.prototype);

Hello.prototype.getMarkup = function() {
    return ('\
        <div id="hello">\
            <button id="hw-button" onclick="Router.routeto(${comp});">Hello?</button>\
        </div>\
    ').$({
        comp: "'/hello/world'"
    });
}

Hello.prototype.getStyle = function() {
    return './src/components/Hello/Hello.css';
}