var Docs = function Docs() {
};

Docs.prototype = Object.create(Component.prototype);

Docs.prototype.getMarkup = function() {
    return ('\
        <div id="docs">\
            <h3>Documentation:</h3>\
            <a href="https://github.com/steven-freed/freedactive/blob/master/README.md">Freedactive Github README</a>\
        </div>\
    ');
}

Docs.prototype.getStyle = function() {
    return './src/components/Docs/Docs.css';
}