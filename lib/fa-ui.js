var faui = (function() {

    var version = 'latest';

    var style = document.createElement('link');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.href = 'https://unpkg.com/freedactive@' + version + '/dist/fa-ui.min.css';
    document.head.appendChild(style);

    var Attr = function(attr) {
        if (!attr) return null;
        return Object.keys(attr).map(function(key) {
            return key + '=' + '"' + attr[key] + '" ';
        }).join('');
    }

    FaButton.prototype = new Component;
    function FaButton(text, attr, style) {
        attr = Attr(attr);
        style = Style(style);

        var faStyle = Style({
            fontSize: '16px',
            borderRadius: '10px',
            outline: 'none',
            padding: '10px 20px'
        });

        this.markup = ('\
        <button class="fa-button" ${attr} style="${style}">${text}</button>\
        ').$({
            attr: attr,
            style: style ? style : faStyle,
            text: text,
        });
    }

    function setVersion(v) { this.version = v; }
    function getVersion() { return this.version; }

    return {
        get: getVersion,
        set: setVersion,
        components: {
            FaButton: FaButton
        }
    }
})();

/**
 * Components
 */
var FaButton = faui.components.FaButton;
