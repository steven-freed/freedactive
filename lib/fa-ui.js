var faui = (function() {

    var version = 'latest';
    fetchCss(version);

    var Attr = function(attr) {
        if (!attr) return null;
        return Object.keys(attr).map(function(key) {
            // function formatting
            if (typeof(attr[key]) === 'function') return key + '=' + '"(' + attr[key] + ')()" ';
            // normal attribute formatting
            else return key + '=' + '"' + attr[key] + '" ';
        }).join('');
    }

    FaButton.prototype = new Component;
    function FaButton(text, attr, style) {
        attr = Attr(attr);
        style = Style(style);

        this.markup = ('\
        <button class="fa-button" ${attr} style="${style}">${text}</button>\
        ').$({
            attr: attr ? attr : '',
            style: style ? style : '',
            text: text ? text : 'Button',
        });
    }

    FaCheckbox.prototype = new Component;
    function FaCheckbox(text, attr, style) {
        attr = Attr(attr);
        style = Style(style);

        this.markup = ('\
        <label class="fa-checkbox">${text}\
            <input type="checkbox" checked="checked">\
            <span class="checkmark"></span>\
        </label>\
        ').$({
            text: text ? text : '',
            attr: attr ? attr : '',
            style: style ? style : ''
        });
    }

    FaGroup.prototype = new Component;
    function FaGroup(inputs, attr, style) {
        attr = Attr(attr);
        style = Style(style);

        this.markup = ('\
        <div class="fa-group">\
            ${inputs}\
        </div>\
        ').$({
            inputs: inputs.map(function(input) { 
                return input.markup;
            }).join(''),
            attr: attr ? attr : '',
            style: style ? style : ''
        });
    }

    FaFAB.prototype = new Component;
    function FaFAB(text, attr, style) {
        attr = Attr(attr);
        style = Style(style);

        this.markup = ('\
        <button class="fa-fab" ${attr} style="${style}">\
            <label>${text}</label>\
        </button>\
        ').$({
            text: text ? text : '',
            attr: attr ? attr : '',
            style: style ? style : ''
        });
    }

    FaRadio.prototype = new Component;
    function FaRadio(text, attr, style) {
        attr = Attr(attr);
        style = Style(style);

        this.markup = ('\
            <label class="fa-radio">${text}\
                <input type="radio" name="radio">\
                <span class="radio"></span>\
            </label>\
        ').$({
            text: text ? text : '',
            attr: attr ? attr : '',
            style: style ? style : ''
        });
    }

    // Needs more work...
    /*
    FaSelect.prototype = new Component;
    function FaSelect(items, attr, style) {

        console.log(items, attr, style);
        attr = Attr(attr);
        style = Style(style);

        item = items ? items[0] : '';

        this.markup = ('\
            <div class="fa-select" ${attr} style="${style}" onclick="${handler}">\
            <div class="custom-select">\
                <div class="custom-select__trigger"><span>${selected}</span>\
                    <div class="arrow"></div>\
                </div>\
                <div class="custom-options">\
                    ${items}\
                </div>\
            </div>\
            </div>\
        ').$({
            handler: 'handler()',
            selected: item,
            items: items.map(function(item, i) {
                if (i == 0) 
                    return '<span class="fa-option selected" data-value="' + item + '">' + item + '</span>';
                else 
                    return '<span class="fa-option" data-value="' + item + '">' + item + '</span>';
            }).join(''),
            attr: attr ? attr : '',
            style: style ? style : ''
        });

       
        this.handler = function() {
            this.querySelector('.custom-select').classList.toggle('open')
            for (option of document.querySelectorAll(".fa-option")) {
                option.addEventListener('click', function() {
                    if (!this.classList.contains('selected')) {
                        this.parentNode.querySelector('.fa-option.selected').classList.remove('selected');
                        this.classList.add('selected');
                        this.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = this.textContent;
                    }
                })
            }
        }


        window.addEventListener('click', function(e) {
            const select = document.querySelector('.custom-select')
            if (!select.contains(e.target)) {
                select.classList.remove('open');
            }
        });

    }
    */

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
            FaCheckbox: FaCheckbox,
            FaGroup: FaGroup,
            FaFAB: FaFAB,
            FaRadio: FaRadio
        }
    }
})();

/**
 * Components
 */
var FaButton = faui.components.FaButton;
var FaCheckbox = faui.components.FaCheckbox;
var FaGroup = faui.components.FaGroup;
var FaFAB = faui.components.FaFAB;
var FaRadio = faui.components.FaRadio;
//var FaSelect = faui.components.FaSelect;