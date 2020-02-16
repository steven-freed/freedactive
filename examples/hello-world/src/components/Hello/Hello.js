Hello.prototype = new Component;

function Hello() {

    this.markup = ('\
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