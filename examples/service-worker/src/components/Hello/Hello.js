Hello.prototype = new Component;

function Hello() {
    this.markup = ('\
        <div id="hello">\
            <button id="hw-button" onclick="Router.routeto(${});">Hello?</button>\
        </div>\
    ').$({
        0: "'/hello/world'"
    });

    this.style = './src/components/Hello/Hello.css';
}