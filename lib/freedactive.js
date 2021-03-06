'use strict';

/**
 * JavaScript Syntax Add On's
 */

/**
 * Splice method for strings
 */
String.prototype.splice = function(start, remove, str) {
    return this.slice(0, start) + str + this.slice(start + Math.abs(remove));
};

/**
 * Support for es6 like backtick syntax
 *  - replaces temporary variable names
 *  ex.
 *      'Hello ${temp}'.$({ temp: 'World' });
 *  - replaces curly cash braces
 *  ex.
 *      'Hello ${}'.$({ 0: 'World' })
 * 
 * Note: if multiple curly cash without temporary
 *  variables, then it will use order you give it.
 *  Object keys must also be unique (convention 0,1,2,etc.)
 * 
 * @param {object} vars key value pairs supporting strings, numbers, and functions templating  
 * @returns {string}
 */
String.prototype.$ = function (vars) {
    if (vars === undefined) return;
    var i = -1;
    var values = Object.values(vars);
    return this.replace(/\${([^${}]*)}/g, function (a, b) {
        if (b === '') {
            i++;
            switch(typeof(values[i])) {
                case 'function':
                    return '(' + values[i].toString() + ')(' + getArgs(values[i]) + ');';
                case 'string':
                    return values[i];
                case 'number':
                    return values[i];
                case 'object':
                    return JSON.stringify(values[i]);
                default:
                    return a;
            }
        } else {
            switch(typeof(vars[b])) {
                case 'function':
                    return '(' + vars[b].toString() + ')(' + getArgs(vars[b]) + ');';
                case 'string':
                    return vars[b];
                case 'number':
                    return vars[b];
                case 'object':
                    return JSON.stringify(vars[b]);
                default:
                    return a;
            }
        }
    });

    /**
     * Parses function as string to get its arguments
     * 
     * @param {function} func 
     */
    function getArgs(func) {
        return func.toString().match(/function.*?\(([^)]*)\)/)[1];
    }
};


/**
 * Freedactive Library
 */
var Freedactive = (function() {

    // Constants
    var APP_CONTAINER = 'app-container';                           // app root container
    var SWITCH_CONTAINER = 'app-switch';                           // switch container for routing
    var SWITCH_METHODS_CONTAINER = 'app-switch-methods-container'; // Switch's current component methods
    var APP_METHODS_CONTAINER = 'app-methods-container';           // non-routed components methods
    var ENTRY_COMPONENT = 'App';                                   // entry component identifier
    var __App__;                                                   // entry component               

    /**
     * Parses JSXString syntax recursively into components with
     * their passed properties.
     * 
     * @returns {string} JSXS syntax converted into pure HTML
     */
    String.prototype.__$jsxs = function __$jsxs() {
        var context = this.toString();
        // matches first opening component tag found
        var regex = new RegExp('<[A-Z][^<>]*(\/>|>)(?=[^"\'`]*(?:["\'`][^"\'`]*["\'`][^"\'`]*)*$)', 'ms');
        var match = this.match(regex);
        if (!match) return context;
    
        // set matching component meta data
        var compMetaName;
        if (match[0].indexOf(' ') > -1) {
            compMetaName = match[0].slice(match[0].indexOf('<') + 1, match[0].indexOf(' '));
        } else {
            compMetaName = match[0].slice(match[0].indexOf('<') + 1,
                            match[0].indexOf('>')).replace(/[^a-zA-Z]/gms, '');
        }
        var compMeta = {
            regexMatch: match[0],                                   // regex opening tag match
            name: compMetaName,                                     // name of component
            start: context.indexOf(match[0]) + match[0].length,     // end of opening tag
            emptyElTag: match[0].indexOf('/>') >= 0 ? true : false  // if closing tag flag
        }
        // parse current context given component meta such as opening tag
        context = jsx$Utils.parse(compMeta, context, function(err) {
            if (err) throw err;
        });

        // returns original context if JSXString cannot
        // be parsed, otherwise final context
        return context ? context : this.toString();
    }

    /**
     * JSX$Utils Module
     * 
     *  - parses components HTML and properties and sets them
     */
    var jsx$Utils = (function() {
        /**
         * Parses html of component, replacing any component
         * tags with the components actual html.
         * 
         * @param {function} comp current component 
         * @param {string} context html for the current string context 
         * @param {function} cb callback for any errors
         */
        function parse(comp, context, cb) {
            try {
                // evaluates component in global scope based
                // on name given in JSXS
                var evalComp = eval(comp.name);
            } catch(err) { 
                return cb(new Error('Could not find component ' + comp.name + ' in global scope.'));
            }
    
            setJsxsProps({
                match: comp.regexMatch,
                component: evalComp
            });
            if (comp.emptyElTag) // empty element tag, aka self closing component tag
            {
                evalComp = new evalComp();
                context = context.replace(comp.regexMatch, evalComp.markup());
            }
            else // closing tag element, has innerHTML (e.g. nested children elements)
            {
                // finds components closing tag
                var regex = new RegExp('<\/' + comp.name + '>', 'gms');
                var matches = context.match(regex);
                // checks if closing tag exists
                if (!matches || matches.length < 1) {
                    return cb(new Error('No closing tag found for component ' + comp.name));
                } else {
                    // finds closing tag index starting at the components opening tag index
                    comp.end = context.indexOf(matches[0], comp.start);
                    // extracts innerHTML of component and sets it as the components prop
                    // to allow for user placement
                    var innerHTML = context.slice(comp.start, comp.end);
                    innerHTML = innerHTML.trim();
                    evalComp.prototype.props['innerHTML'] = innerHTML;
                    evalComp = new evalComp();
                    // breaks up and reassembles html context with component tags actual html
                    context = context.slice(0, comp.start - comp.regexMatch.length) + 
                                evalComp.markup() + 
                                context.slice(comp.end + matches[0].length, context.length);
                }
            }
            // - checks for nested component tags within an opening and closing tag
            // - checks self closing tag components markup for component tags
            context = context.__$jsxs();
            // puts non-routed component methods into script tags
            Utils.addMethods(APP_CONTAINER, Utils.getMethods(evalComp));
            evalComp.componentMounted();
            return context;
        }
        
        /**
         * Sets any JSXS props from a component tag to actual
         * properties that can be accessed in a component via
         * the props property (e.g. 'this.props')
         * 
         * @param {function} comp component
         */
        function setJsxsProps(comp) {
            // constants
            var SELF_CLOSING_TAG = '/>';
            var CLOSING_TAG = '>';
            var DELIMETER = ';';
            // parses open tag string of component to isolate props
            var indexOfProps = comp.match.indexOf(comp.component.name) + comp.component.name.length + 1;
            var propStr = comp.match.slice(indexOfProps);
            propStr = propStr.replace(SELF_CLOSING_TAG, '');
            propStr = propStr.replace(CLOSING_TAG, '');
            /**
             * Regex for spaces that are not in quotes.
             * 
             * /\s(?=[^"'`]*(?:["'`][^"'`]*["'`][^"'`]*)*$)/gms
             * 
             *  - delimits by props and not prop values if they
             *    contain spaces
             */
            propStr = propStr.replace(/\s(?=[^"'`]*(?:["'`][^"'`]*["'`][^"'`]*)*$)/gms, DELIMETER);
            // removes first and last delimeter if they exist
            if (propStr[0] === DELIMETER) propStr = propStr.slice(1);
            if (propStr[propStr.length - 1] === DELIMETER) propStr = propStr.slice(0, propStr.length - 1);
            // turns props into array of strings
            propStr = propStr.includes(DELIMETER) ? propStr.split(/;(?=[^"'`]*(?:["'`][^"'`]*["'`][^"'`]*)*$)/) : [propStr];
            // turns props strings into object prop (key, val) pairs
            var props = {};
            for (var p = 0; p < propStr.length; p++) {
                var firstQuote = propStr[p].indexOf('"');
                var key = propStr[p].slice(0, propStr[p].indexOf('='));
                var val = propStr[p].slice(firstQuote + 1, propStr[p].length - 1);
                // checks that key and val are not the empty string
                if (key && val) props[key] = val;
            }
            // sets props property for component
            if (typeof comp.component === 'function') {
                comp.component.prototype.props = props;
            }
        }

        return {
            parse: parse
        };
    })();

    /**
     * Component Prototype to inherit
     */
    var Component = function Component() {
        this.__$props = {};
        this.__$markup = ''; 

        /**
         * Method to turn markup string into JSXS
         */
        this.__$jsxsifyMarkup = function() {
            this.__$markup = this.markup().__$jsxs()
            return this.__$markup;
        };
         /**
         * Props getter and setter
         *  - properties from JSXS component tags
         */
        this.props = {
            get props() {
                return this.__$props;
            },
            set props(props) {
                this.__$props = props; 
            }
        };
        
        this.markup = this.markup.bind(this);
    }
     /**
     * Renders components markup
     */
    Component.prototype.markup = function() {
        return ('');
    }
    /**
     * Component has rendered to DOM
     */
    Component.prototype.componentMounted = function() {}
    /**
     * Component is about to be removed from DOM
     */
    Component.prototype.componentUnmounted = function() {}


    /**
     * Initializes web app by loading scripts and styles into
     * DOM head. Sets window 'load' listener to load entry component
     * and its children.
     * 
     * @param {function} root entry component (e.g. 'App')
     * @param {object} imports contains array of script paths and style paths (js, css)
     * @param {object} options options like if using js modules
     */
    function init(root, imports, options) {
        __App__ = root;
        var _$app = new __App__(); 
        ENTRY_COMPONENT = root.name ? root.name : ENTRY_COMPONENT;
     
        importScriptsAndStyles(imports, options, function(err) {
            if (err) {
                throw err;
            } else {
                window.addEventListener('load', function() {
                    loadEntry(_$app, function(err, path) {
                        if (err) throw err;
                        if (path !== '/') window.dispatchEvent(new Event('popstate'));
                    });
                });
            }
        });

        window.onbeforeunload = function() {
            _$app.componentUnmounted();
        }
    };

    /**
     * Replacement for manually writing html tags. Creates tags in
     * the DOM for js and css files.
     * 
     * @param {object} imports js and css paths for files to import 
     * @param {object} options true if you are using modules 
     * @param {function} cb callback for error handling
     */
    function importScriptsAndStyles(imports, options, cb) {
        if (!Object(options).hasOwnProperty('modules')) options = { modules: false };
        if (imports === undefined) return cb(new Error('Missing scripts and styles imports ' +
                                                        'please pass an empty object "{}" if there are ' +
                                                        'no imports.'));
    
        if (imports['scripts']) {
            imports.scripts.map(function(path) {
                // scripts
                var script = document.createElement('script');
                script.src = path;
                if (options.modules) script.type = 'module';
                document.head.appendChild(script);
            });
        }
        if (imports['styles']) {
            imports.styles.map(function(path) {
                // styles
                var style = document.createElement('link');
                style.type = 'text/css';
                style.rel = 'stylesheet';
                style.href = path;
                document.head.appendChild(style);
            });
        }
        return cb(null);
    }

    /**
     * Loads your entry component and other needed components based on
     * the url, then parses through its JSXS recursively, adds entry
     * component methods and returns callback error.
     * 
     * @param {function} cb callback for when entry component has finished loading
     */
    function loadEntry(comp, cb) {        
        try {
            // checks for app-container and parses url for path
            var container = document.getElementById(APP_CONTAINER);
            if (!container) {
                throw new Error('Could not find the "app-container" div tag required by Freedactive.');
            }
            var path = location.href.slice(location.href.indexOf('/', 8));
        } catch(err) {
            return cb(err, null);
        }
        
        try {
            // loads entry component, parses through its jsxs, sets containers
            // html and loads entry components methods
            container.innerHTML = comp.__$jsxsifyMarkup();
            // puts entry component methods into script tag
            Utils.addMethods(container.id, Utils.getMethods(comp));
            comp.componentMounted();
        } catch (err) {
            return cb(err, null);
        }
        return cb(null, path);
    };


    /**
     * Utils Module
     * 
     *  - method and attribute parsers
     */
    var Utils = (function() {

        var lifeCycleMethods = [
            'constructor',
            'markup',
            'componentMounted',
            'componentUnmounted'
        ];

        /**
         * Converts anonymous functions to traditional named fuctions.
         * 
         * @param {Array} userMethods methods of any kind
         * @returns {string} all non-library component methods concatenated
         */
        function aton(userMethods) {
            return Object.keys(userMethods).map(function(method) {
                    var FUNCTION = 'function';
                    var SPACE = ' ';
                    var funcBody = userMethods[method].toString();
                    // function signature, everything before first '('
                    var sig = funcBody.slice(0, funcBody.indexOf('{'));
                    sig = sig.slice(0, funcBody.indexOf('('));
                    var f = sig.indexOf(FUNCTION);
                    // if method has keyword 'function'
                    if (f > -1) {
                        funcBody = funcBody.splice(f + FUNCTION.length, 0, SPACE + method + SPACE);
                    } else {
                    // if class method
                        funcBody = FUNCTION + ' ' + funcBody;
                    }
                    return funcBody;
                }).join('\n');
        };

        /**
         * Returns a component copy containing ONLY user
         * defined public methods and the 'style' property.
         * 
         * @param {function} component user defined component
         * @returns {object} non-library function props 
         */
        function getMethods(component) {
            var componentProps = {};
            Object.getOwnPropertyNames(component.__proto__).map(function(prop) {
                if (lifeCycleMethods.indexOf(prop) < 0 &&
                    typeof component.__proto__[prop] === 'function' &&
                    !prop.startsWith('_'))
                    componentProps[prop] = component.__proto__[prop];
            }); 
            return componentProps;
        };

        /**
         * Adds a components methods to the DOM as a script tag
         * 
         * @param {string} container app-container or switch-container
         * @param {string} userMethods concatinated component methods 
         */
        function addMethods(container, userMethods) {
            if (Object.keys(userMethods).length) {
                var methodsStr = Utils.aton(userMethods);
                var js = document.createElement('script');
                js.id = container === SWITCH_CONTAINER ? SWITCH_METHODS_CONTAINER : APP_METHODS_CONTAINER;
                js.type = 'text/javascript';
                if (document.getElementById(js.id)) {
                    js = document.getElementById(js.id);
                    js.innerText = '';
                    js.appendChild(document.createTextNode(methodsStr));
                } else if (document.getElementById(container)){
                    js.appendChild(document.createTextNode(methodsStr));
                    document.getElementById(container).appendChild(js);                   
                }
            }
        }

        /**
         * Formats an object into a list of html element attributes
         * 
         * @param {object} attr html element attributes 
         */
        function Attr(attr) {
            if (!attr) return '';
            return Object.keys(attr).map(function(key) {
                // function formatting
                if (typeof(attr[key]) === 'function') return key + '=' + '\"(' + attr[key] + ')()\" ';
                // normal attribute formatting
                else if (key && attr[key]) return key + '=' + '\"' + attr[key] + '\" ';
            }).join('');
        }

        return {
            aton: aton,
            addMethods: addMethods,
            getMethods: getMethods,
            Attr: Attr
        };
    })();

    /**
     * Stringifys routes object so that Switch can interpret it correctly.
     * 
     * @param {object} routes { path: component } pairs of paths and their associated component
     * @returns {string} string representation that Switch understands
     */
    function Route(routes) {
        var delimitedRoutes = '';
        if (!routes || routes === undefined) return '';
        for (var path in routes) {
            if (typeof routes[path] === 'function' &&
                (routes[path].prototype.constructor.name === 'Component' ||
                routes[path].__proto__.name === 'Component')) {
                delimitedRoutes += path + ':' + routes[path].name + ';';
            }
        }
        return delimitedRoutes;
    }

    /**
     * Inline Style creator, uses camel casing object literals
     * and converts them to standard css dashed conventions.
     *
     * @param {object} style property, value object literal using camel casing 
     * @returns {string} inline css style string
     */
    function Style(style) {
        if (!style) return style;
        var styleList = Object.keys(style).map(function(key) {
            var dashed = key.replace(/[A-Z]/g, function(m) {
                return '-${m}'.$({ m: m.toLowerCase() });
            });
            return '${prop}:${value};'.$({
                prop: dashed,
                value: style[key]
            });
        });
        return styleList.join('');
    };


    /**
     * State managment
     * 
     * @param {function} reducer reducer function
     * @param {object} state optional starting state 
     */
    function State(reducer, state) {
        var reducer = reducer;
        var state = state;
        var listeners = [];

        /**
         * Gets the current state for your instance
         * 
         * @returns your instances state
         */
        this.getState = function() { return state; }

        /**
         * Publishes an action to your state instance
         * 
         * @param {object} action your action
         * @returns {object} your action
         */
        this.pub = function(action) {
            state = reducer(state, action);
            listeners.forEach(function(listener) {
                listener();
            });
            return action;
        }

        /**
         * Subscribes your state instance to a callback
         * event handler.
         * 
         * @param {function} eventHandler your listener for publishes
         */
        this.sub = function(eventHandler) {
            listeners.push(eventHandler);
            return function unsub() {
                listeners.splice(listeners.indexOf(eventHandler), 1);
            };
        }
    };


    /**
     * Switch Component Used For Routing
     */
    Switch.prototype = new Component;
    function Switch() {
        var required = [
            'routes'
        ];

        // checks for required attributes
        try {
            var props = this.props;
            required.map(function(prop) {
                if (!props[prop]) throw new Error('Switch requires the attribute "' 
                                                        + prop + '" to function correctly.');
            });
        } catch(err) {
            throw err;
        }

        var routes = this.getRoutes(this.props.routes);
        routes['/'] = __App__;
       
        var prevComp = null;
        window.onpopstate = function() {
            var path, comp;
            try {
                path = location.href.slice(this.location.href.indexOf('/', 8));
                comp = routes[path];
                comp = new comp();
            } catch(err) {
                path = '/';
                comp = routes['/'];
            }

            if (prevComp && !(prevComp instanceof __App__)) prevComp.componentUnmounted();
            if (path === '/') {
                document.getElementById(SWITCH_CONTAINER).innerHTML = '';
            } else {
                // puts components methods into a script tag
                Utils.addMethods(SWITCH_CONTAINER, Utils.getMethods(comp));
                document.getElementById(SWITCH_CONTAINER).innerHTML = comp.__$jsxsifyMarkup();
                comp.componentMounted();
            }
            prevComp = comp;
        };

    };

    Switch.prototype.markup = function() {

        var style = Style({
            position: 'absolute',
            textAlign: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgb(113, 47, 242)'
        });

        return ('<div id=\"${}\" style=\"${}\"></div>').$({
            0: SWITCH_CONTAINER,
            1: this.props['style'] ? this.props['style'] : style
        });
    }

    // Parses routes for Switch
    Switch.prototype.getRoutes = function(str) {
        var routeObj = {};
        var routeList = str.split(';');
        for (var i = 0; i < routeList.length; i++) {
            var pair = routeList[i].split(':');
            if (pair[0] && pair[1]) {
                routeObj[pair[0]] = eval(pair[1]);
            }
        }
        return routeObj;
    }

    /**
     * Link Component Used With Switch For Routing
     */
    Link.prototype = new Component;
    function Link() {
        var required = [
            'path'
        ];
        // checks for required attributes
       try { 
            var props = this.props;
            required.map(function(prop) {
                if (!props[prop]) throw new Error('Link requires the attribute "' +
                                                    prop + '" and the JSXS component ' +
                                                    'Switch to function correctly.');
            });
        } catch(err) {
            throw err;
        }
    };

    Link.prototype.markup = function() {
        // use innerHTML else nothing
        var innerHTML = '';
        if (this.props['innerHTML'])
            innerHTML = this.props['innerHTML'];

        // remove custom props so standard props can be rendered
        var attr = Object.assign({}, this.props);
        delete attr['path'];
        delete attr['innerHTML'];
        attr = Utils.Attr(attr);

        return ('<a href=\"${path}\" ${attr} onclick=\"Freedactive.__$router.__$pushState(event)\"' +
                '>${innerHTML}</a>').$({
            path: this.props['path'] ? this.props['path'] : '/',
            attr: attr,
            innerHTML: innerHTML
        });
    }

    var __$router = {
        // event handler for hrefs without reloading page
        __$pushState: function(e) {
            e.preventDefault();
            if (e.target.pathname === undefined) {
                window.history.pushState(null, '', e.target.parentNode.pathname);
            } else {
                window.history.pushState(null, '', e.target.pathname);
            }
            window.dispatchEvent(new Event('popstate'));
        }
    };

    /**
     * Public API methods
     */
    return {
        init: init,
        Style: Style,
        State: State,
        Component: Component,
        Switch: Switch,
        Link: Link,
        Route: Route,
        __$router: __$router
    };
})();

/**
 * Pubic API
 */
// components
var Component = Freedactive.Component;
var Style = Freedactive.Style;
// state management
var State = Freedactive.State;
// routing
var Switch = Freedactive.Switch;
var Link = Freedactive.Link;
var Route = Freedactive.Route;

// node.js testing
global.Freedactive = Freedactive;
global.State = State;
global.Style = Style;
global.Route = Route;
global.Component = Component;