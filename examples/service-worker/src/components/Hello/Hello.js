Hello.prototype = new Component;

function Hello() {
    this.markup = ('\
        <div id="hello">\
            <button id="hw-button" onclick="Router.routeto(${comp});">Hello?</button>\
        </div>\
    ').$({
        comp: "'/hello/world'"
    });

    this.style = './src/components/Hello/Hello.css';
}