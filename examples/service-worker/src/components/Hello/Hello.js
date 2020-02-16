Hello.prototype = new Component;

function Hello() {

}

Hello.prototype.markup = function() {
    return ('\
        <div id="hello">\
            <Link \
                id="hw-button" \
                class="fa-link" \
                path="${}">Hello</Link>\
        </div>\
    ').$({
        0: '/hello/world'
    });
}