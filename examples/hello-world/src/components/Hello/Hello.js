Hello.prototype = new Component;

function Hello() {
    this.markup = ('\
        <div id="hello">\
            <Link path="${}" name="Hello" id="hw-button"/>\
        </div>\
    ').$({
        0: '/hello/world'
    });
}