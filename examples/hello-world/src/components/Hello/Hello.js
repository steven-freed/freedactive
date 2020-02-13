Hello.prototype = new Component;

function Hello() {
    this.markup = ('\
        <div id="hello">\
            <button id="hw-button">Hello?</button>\
        </div>\
    ').$({
        0: "'/hello/world'"
    });
}