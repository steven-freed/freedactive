Hello.prototype = new Component;

function Hello() {

    this.markup = ('\
        <div id="hello">\
        <Link \
            id="hw-button" \
            class="fa-link" \
            path="${}" \
            name="Hello"\
            />\
        </div>\
    ').$({
        0: '/hello/world'
    });

}