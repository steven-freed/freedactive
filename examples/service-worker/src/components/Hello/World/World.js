function World() {
    this.getMarkup = function() {
        return ('\
            <div id="world">\
                <h1>World!</h1>\
            </div>\
        ');
    }

    this.getStyle = function() {
        return './src/components/Hello/World/World.css';
    }
};
