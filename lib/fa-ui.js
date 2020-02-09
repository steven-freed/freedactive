var faui = (function() {

    var version = 'latest';
    fetchCss(version);

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

        this.markup = ('\
        <button class="fa-button" ${attr} style="${style}">${text}</button>\
        ').$({
            attr: attr,
            style: style ? style : '',
            text: text,
        });
    }

    // TODO: needs work...
    FaCheckbox.prototype = new Component;
    function FaCheckbox(text, attr, style) {
        attr = Attr(attr);
        style = Style(style);

        this.markup = ('\
        <div class="fa-checkbox">\
            <input id="fa-checkbox" type="checkbox" ${attr} style="${style}">\
            <label for="fa-checkbox"><span>${text}</span></label>\
        </div>\
        ').$({
            text: text,
            attr: attr,
            style: style ? style : ''
        });
    }

    /**
     * Versioning and util methods
     */
    function fetchCss(version) {
        var style = document.createElement('link');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.href = 'https://unpkg.com/freedactive@' + version + '/dist/fa-ui.min.css';
        style.id = 'faui@' + version;
        document.head.appendChild(style);
    }
    function setVersion(v) {
        document.getElementById('faui@' + version).remove();
        fetchCss(v);
        this.version = v;
    }
    function getVersion() { return this.version; }

    return {
        get: getVersion,
        set: setVersion,
        components: {
            FaButton: FaButton,
            FaCheckbox: FaCheckbox
        }
    }
})();

/**
 * Components
 */
var FaButton = faui.components.FaButton;
var FaCheckbox = faui.components.FaCheckbox;