Docs.prototype = new Component;
    
function Docs() {

}

Docs.prototype.markup = function() {
    return ('\
        <div id="docs">\
            <h3>Documentation:</h3>\
            <a class="ref" href="https://github.com/steven-freed/freedactive/blob/master/README.md">Freedactive Github README</a>\
        </div>\
    ');
}