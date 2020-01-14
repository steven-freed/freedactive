function Hello() {

    this.getMarkup = function() {
        return ('\
            <div id="hello">\
                <button id="hw-button" onclick="Router.routeto(${comp});">Hello?</button>\
            </div>\
        ').$({
            comp: "'/hello/world'"
        });
    }

    this.getStyle = function() {
        return './src/components/Hello/Hello.css';
    }
};
