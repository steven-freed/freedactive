function Docs() {
    this.getMarkup = function() {
        return ('\
            <div id="docs">\
                <h3>Documentation:</h3>\
                <a href="https://github.com/steven-freed/freedactive/blob/master/README.md">Freedactive Github README</a>\
            </div>\
        ');
    }

    this.getStyle = function() {
        return './src/components/Docs/Docs.css';
    }
};
