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

    function getArgs(func) {
        return func.toString().match(/function.*?\(([^)]*)\)/)[1];
    }
};


/**
 * Freedactive Library
 */
var Freedactive = (function() {

    // Constants and closures
    var APP_CONTAINER = 'app-container';            // app root container
    var SWITCH_CONTAINER = 'app-switch';            // switch container for routing
    var ENTRY_COMPONENT = 'App';                    // entry component identifier
    var App;                                        // entry component                        

    String.prototype._jsx$ = function _jsx$() {
        var context = this.toString();
        // match all opening component tags
        var regex = new RegExp('<[A-Z][^<>]*(\/>|>)(?=[^"\'`]*(?:["\'`][^"\'`]*["\'`][^"\'`]*)*$)', 'gms');
        var matches = this.match(regex);
        if (!matches) return context;
    
        // parse matches and set component meta data
        for (var match of matches) {
            var compMeta = {
                regexMatch: match,                                              // regex opening tag match
                name: match.slice(match.indexOf('<') + 1, match.indexOf(' ')),  // name of component
                start: context.indexOf(match) + match.length,                   // end of opening tag
                emptyElTag: match.indexOf('/>') >= 0 ? true : false             // if closing tag flag
            }
            context = jsx$Utils.parse(compMeta, context);
        }
        // returns original context if JSX string cannot be parsed
        return context ? context : this.toString();
    }

    var jsx$Utils = (function() {

        /**
         * Parses html of component, replacing any component
         * tags with the components actual html.
         * 
         * @param {function} comp current component 
         * @param {string} context html for the current string context 
         */
        function parse(comp, context) {
            // empty element tag, aka self closing component tag
            if (comp.emptyElTag) {
                setProps({
                    match: comp.regexMatch,
                    component: window[comp.name]
                })
                try {
                    var windowComp = new window[comp.name]();
                    context = context.replace(comp.regexMatch, windowComp.markup);
                } catch(err) {
                    throw new Error('Component ' + comp.name + ' not found while parsing JSXS.');
                }
            // opening and closing tag with possible nested component tags
            } else {
                // finds components closing tag
                var regex = new RegExp('<\/' + comp.name + '>', 'gms');
                var matches = context.match(regex);
                if (!matches || matches.length < 1) throw new Error('No closing tag found for component ' + comp.name);
                
                if (matches.length) {
                    // finds closing tag index starting at the components opening tag index
                    comp.end = context.indexOf(matches[0], comp.start);
                    // extracts innerHTML of component and sets it as the components prop
                    // to allow for user placement
                    var innerHTML = context.slice(comp.start, comp.end);
                    innerHTML = innerHTML.trim();
                    window[comp.name].prototype.props = {
                        innerHTML: innerHTML
                    };
                    try {
                        var winComp = new window[comp.name]();
                        // breaks up and reassembles html context with component tags actual html
                        context = context.slice(0, comp.start - comp.regexMatch.length) + 
                                    winComp.markup + 
                                    context.slice(comp.end + matches[0].length, context.length);
                    } catch(err) {
                        throw new Error('Component ' + comp.name + ' not found while parsing JSXS.');
                    }
                }
            }
            // - checks for nested component tags within an opening and closing tag
            // - checks self closing tag components markup for component tags
            context = context._jsx$();
            return context;
        }
        
        function setProps(comp) {
            // constants
            var CLOSING_TAG = '/>';
            var DELIMETER = ';';
            // parses open tag string of component to isolate props
            var indexOfProps = comp.match.indexOf(comp.component.name) + comp.component.name.length + 1;
            var propStr = comp.match.slice(indexOfProps);
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
            for (var p of propStr) {
                var firstQuote = p.indexOf('"');
                var key = p.slice(0, p.indexOf('='));
                var val = p.slice(firstQuote + 1, p.length - 1);
                // checks that key and val are not the empty string
                if (key && val) props[key] = val;
            }
            // sets props property for component
            if (typeof comp.component === 'function') {
                for (var p in props) {
                    if (typeof props[p] === 'function') {
                        // TODO fix this to put all functional properties inside a script tag
                        Utils.addMethods(APP_CONTAINER,
                            Utils.getMethods(winComp, Object.getOwnPropertyNames(Component.prototype)),
                            winComp);
                    } else {
                        comp.component.prototype.props[p] = props[p];
                    }
                }
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
        this._markup = '';
        this._props = {};
        // for router to run '_jsx$' function on markup
        this._jsxify = function() {
            this._markup = this.markup._jsx$();
        }
    };
    /**
     * Markup is a string of html
     */
    Object.defineProperty(Component.prototype, 'markup', {
        set: function(markup) {
            this._markup = markup;
        },
        get: function() {
            return this._markup;
        }
    });
    /**
     * Props for JSXS component tags
     */
    Object.defineProperty(Component.prototype, 'props', {
        set: function(props) {
            this._props = props;
        },
        get: function() {
            return this._props;
        }
    });


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
        App = root;
        ENTRY_COMPONENT = root.name ? root.name : ENTRY_COMPONENT;
        console.log(ENTRY_COMPONENT)

        importScriptsAndStyles(imports, options, function(err) {
            if (err) {
                throw err;
            } else {
                window.addEventListener('load', function() {
                    loadEntry(APP_CONTAINER, function(err) {
                        if (err) window.dispatchEvent(new Event('popstate'));
                    });
                });
            }
        });
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
        if (imports === undefined) return cb(new Error('Missing Component and Style imports.'));
    
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
     * Routes SPA by loading entry component and its children on 'load' event
     * and loading url related component in Router on 'routeto' invocations. 
     * 
     * @param {String} root name of component container to be swapped during route changes
     */
    function loadEntry(root, cb) {        
        // get current component
        var container = null || document.getElementById(root);
        var path = location.href.slice(location.href.indexOf('/', 8));
        
        // sets container with current route's markup
        try {
            var rt = new App();
            rt._jsxify();
            container.innerHTML = rt.markup;
            // loads script with methods for current component
            Utils.addMethods(container, Utils.getMethods(rt, Object.getOwnPropertyNames(Component.prototype)), rt);
        } catch (e) {
            throw e;
        }
    
        return path === '/' ? cb(null) : cb(new Error('Component not found for path.'));
    };


    /**
     * Utils Module
     */
    var Utils = (function() {

        /**
         * Converts anonymous functions to traditional named fuctions.
         * 
         * @param {Array} userMethods methods of any kind
         * @returns {String} all non-library component methods concatenated
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
                    if (f > -1)
                        funcBody = funcBody.splice(f + FUNCTION.length, 0, SPACE + method + SPACE);
                    return funcBody;
                }).join('\n');
        };

        /**
         * Returns a component copy containing ONLY user
         * defined public methods and the 'style' property.
         * 
         * @param {Function} component user defined component
         * @returns {Object} non-library function props 
         */
        function getMethods(component, props) {
            var componentProps = Object.assign({}, component);
            Object.keys(componentProps).map(function(prop) {
                if (props.includes(prop))
                    delete componentProps[prop];
                if (typeof(componentProps[prop]) !== 'function')
                    delete componentProps[prop];
                if (prop[0] === '_')
                    delete componentProps[prop];
            }); 
            return componentProps;
        };

        /**
         * Creates a script or link element and inserts it into the DOM
         * in the provided container. 
         * 
         * @param {Element} container container to insert style or script
         * @param {Array} userMethods user defined public methods
         * @param {Object} component routing component
         */
        function addMethods(container, userMethods, component) {
            // insert user component methods as a script
            if (Object.keys(userMethods).length) {
                var methodsScript = Utils.aton(userMethods);
                var js = document.createElement('script');
                js.type = 'text/javascript';
                js.appendChild(document.createTextNode(methodsScript));
                container.appendChild(js);
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
                if (typeof(attr[key]) === 'function') return key + '=' + '"(' + attr[key] + ')()" ';
                // normal attribute formatting
                else if (key && attr[key]) return key + '=' + '"' + attr[key] + '" ';
            }).join('');
        }

        return {
            aton: aton,
            addMethods: addMethods,
            getMethods: getMethods,
            Attr: Attr
        };
    })();

    function Routes(routes) {
        var delimitedRoutes = '';
        if (!routes || routes === undefined) return '';
        for (var path in routes) {
            if (typeof routes[path] === 'function') {
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
     * @returns {String} inline css style string
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
     * @param {Function} reducer reducer function
     * @param {Object} state optional starting state 
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
         * @param {Object} action your action
         * @returns {Object} your action
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
         * @param {Function} eventHandler your listener for publishes
         */
        this.sub = function(eventHandler) {
            listeners.push(eventHandler);
            return function unsub() {
                listeners.splice(listeners.indexOf(eventHandler), 1);
            };
        }
    };


    Switch.prototype = new Component;
    function Switch() {
        var style = Style({
            position: 'absolute',
            textAlign: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgb(113, 47, 242)'
        });

        this.markup = '<div id="${}" style="${}"></div>'.$({
            0: SWITCH_CONTAINER,
            1: this.props['style'] ? this.props['style'] : style
        });
        var routes = getRoutes(this.props.routes);
        routes['/'] = App;
       
        window.onpopstate = function() {
            var path = location.href.slice(this.location.href.indexOf('/', 8));
            if (path === '/') {
                document.getElementById('app-switch').innerHTML = '';
            } else {
                var comp = routes[path];
                comp = new comp();
                comp._jsxify();
                document.getElementById('app-switch').innerHTML = comp.markup;
            }
        };

        function getRoutes(str) {
            var routeObj = {};
            var routeList = str.split(';');
            for (var i = 0; i < routeList.length; i++) {
                var pair = routeList[i].split(':');
                try {
                    if (pair[0] && pair[1]) {
                        routeObj[pair[0]] = window[pair[1]];
                    }
                } catch(err) {
                    throw new Error('Component' + pair[1] + 'given to "Routes" does not exist.');
                }
            }
            return routeObj;
        } 

    };

    Link.prototype = new Component;
    function Link() {
        // use innerHTML, else name, else nothing
        var innerHTML = '';
        if (this.props['innerHTML'])
            innerHTML = this.props['innerHTML'];
        else if (this.props['name'])
            innerHTML = this.props['name'];

        // remove custom props so standard props can be rendered
        var attr = Object.assign({}, this.props);
        delete attr['path'];
        delete attr['innerHTML'];
        delete attr['name'];
        attr = Utils.Attr(attr)

        this.markup = ('<a href="${path}" ${attr} \
            onclick="${handler}">${innerHTML}</a>').$({
                path: this.props['path'] ? this.props['path'] : '/',
                attr: attr,
                handler: _,
                innerHTML: innerHTML
            });

            // event handler for hrefs without reloading page
            function _(event) {
                event.preventDefault();
                if (event.target.pathname === undefined) 
                    this.window.history.pushState(null, '', event.target.parentNode.pathname);
                else
                    this.window.history.pushState(null, '', event.target.pathname);
                this.window.dispatchEvent(new Event('popstate'));
            }
    };


    /**
     * Public API methods
     */
    return {
        init: init,
        Router: Router,
        Style: Style,
        State: State,
        Component: Component,
        Switch: Switch,
        Link: Link,
        Routes: Routes
    };
})();


/**
 * Pubic API
 */
var Component = Freedactive.Component;
var Router = Freedactive.Router;
var Style = function(style) {
    return Freedactive.Style(style);
};
var State = Freedactive.State;
var Switch = Freedactive.Switch;
var Link = Freedactive.Link;
var Routes = Freedactive.Routes;

// used for node.js testing
/*
global.Freedactive = Freedactive;
global.State = State;
global.Style = Style;
global.Router = Router;
global.Component = Component;*/