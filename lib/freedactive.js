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
    var ROUTER_CONTAINER = 'app-router-container';  // router container
    var ENTRY_COMPONENT = 'App';                    // entry component identifier
    var App;                                        // entry component
    var components = {                              // components store
        _Switch: Switch,
        _Link: Link
    };                                
    
    /**
     * Interprets strings as 'JSX' syntax and returns
     * a string of normal html. Requires closing tag like
     * JSX.
     *  - supports new lines and spaces
     *   ex.
     *      <App/>, <App />, <App
     *                          />
     *  - supports properties like html elements
     *   ex.
     *      <App name="Freedactive" hello="world" />
     *  
     * Note: Component tags start with a capital letter
     */
    String.prototype._JSX = function _JSX() {
        console.log('JSX');
        // sets router in components so that it can be
        // rendered in JSX strings
        var html = this.toString();

        // sets the component's markup whose markup is 'this'
        // strings context 
        (function setMarkup(context) {
            /**
             * JSX Regex to find; unquoted, capitalized, non-nested
             *  components to turn their tags into their html
             * 
             *  <[A-Z][^<>]*\/>
             *
             *  < 	    literal 
             *  A-Z 	any capital letter
             *  [^<>]	any character not '<' or '>' zero or more times
             *  \/> 	escaped closing tag literal
             *
             *  (?=[^"'`]*(?:["'`][^"'`]*["'`][^"'`]*)*$)
             *
             *  ?= 				    look ahead
             *  [^"'`] 			    match 0 or more non quote chars
             *  ?: 				    start non-capturing group 0 or more times
             *  ["'`][^"'`]*["'`] 	a single quoted piece of text
             *  [^"'`]* 			0 or more non-quote chars
             *  )* 				    end non-capturing group
             *  $) 				    end look ahead
             * 
             */
            var regex = new RegExp('<[A-Z][^<>]*\/>(?=[^"\'`]*(?:["\'`][^"\'`]*["\'`][^"\'`]*)*$)', 'gms');
            var matches = context.match(regex);
            // if no matches exist
            if (!matches) return;
            matches.map(function(match) {
                var name = match.slice(1, match.indexOf(' '));
                var component = window[name];
                setProps({
                    index: context.indexOf(match),
                    match: match,
                    component: component
                });
                component = new component();
                html = context.replace(match, component.markup);
                setMarkup(html);
            });

            return html
        })(this.toString());
        
        function setProps(comp) {
            // populates properties of component
            var CLOSING_TAG = '/>';
            var DELIMETER = ';';

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
            propStr = propStr.includes(DELIMETER) ? propStr.split(DELIMETER) : [propStr];
            // turns props strings into object prop key, val pairs
            var props = {};
            for (var p of propStr) {
                var firstQuote = p.indexOf('"');
                var key = p.slice(0, p.indexOf('='));
                var val = p.slice(firstQuote + 1, p.length - 1);
                props[key] = val;
            }
            // sets props property for component
            if (typeof comp.component === 'function') comp.component.prototype.props = props;
        }

        return html;
    };

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
            else return key + '=' + '"' + attr[key] + '" ';
        }).join('');
    }

    /**
     * Component Prototype to inherit from
     */
    var Component = function Component() {
        this._markup = '';
        this._props = {};
        // for router to run '_JSX' function on markup
        this._jsxify = function(component) {
            this._markup = component.markup._JSX();
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
     * Props for JSX markup
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
     * Initializes entry component and imports
     * any component listed in 'comps' as a script tag.
     * Adds window and popstate listeners and initializes 
     * the Router.
     * 
     * @param {function} root 'App' component 
     * @param {Array} comps paths to all components
     */
    function init(root, imports, options) {
        App = root;
        ENTRY_COMPONENT = root.name ? root.name : ENTRY_COMPONENT;
        components['/'] = App;

        importScriptsAndStyles(imports, options, function(err) {
            if (err) {
                throw err;
            } else {
                window.addEventListener('load', function() {
                    router(APP_CONTAINER);
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
            //setTimeout(function() {}, 10);
        return cb(null);
    }

    /**
     * Routes SPA by loading entry component and its children on 'load' event
     * and loading url related component in Router on 'routeto' invocations. 
     * 
     * @param {String} root name of component container to be swapped during route changes
     */
    function router(root) {        

        // get current component
        var container = null || document.getElementById(root);
        var url = Utils.parseUrl();
        var rt = components[url] ? new components[url]() : null;
        
        // prevents page reloads when using Router if ENTRY_COMPONENT is the route 
        if (components[url] && root === ROUTER_CONTAINER && components[url].name === ENTRY_COMPONENT) {
            container.innerHTML = '';
            return;
        } else {
            // sets container with current route's markup
            try {
                // if route is currently unknown and is not the root route
             //   if (!rt && url !== '/') { 
                    rt = new App();
                    rt._jsxify(rt);
                    console.log(rt);
                    container.innerHTML = rt.markup;
              //  } else {
                    // routes are known and we can load routed component
               //     rt._jsxify(rt);
                //    container.innerHTML = rt.markup;
              //  }
            } catch (e) {
                throw e;
            }
        }
    
        // loads scripts and styles for current route
        Utils.addMethods(container, Utils.getMethods(rt, Object.getOwnPropertyNames(Component.prototype)), rt);
    };


    /**
     * Utils Module
     */
    var Utils = (function() {

        /**
         *  Parses the url
         * 
         * @returns {String} the parsed url mapping to a Router component
         */
        function parseUrl() {
            var url = location.href;
            url = url.slice(url.indexOf('/', 8));
            return url;
        };

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
        };

        return {
            parseUrl: parseUrl,
            aton: aton,
            addMethods: addMethods,
            getMethods: getMethods
        };
    })();


    /**
     * Singleton Router to route different components to different routes.
     */
    var Router = (function() {

        /**
         * Initializes the component Router.
         * 
         * @param {Object} comps path, component pairs to initialize router
         * @param {Object} style optional style or router container
         */
        function init(comps) {
            for (var path in comps) {
                components[path] = comps[path];
            }
        };

        /**
         * Event listener for route changes. Should be registered with
         * html element such as a button, li, etc.
         * 
         * @param {string} link the specified route to listen for 
         */
        function routeto(link) {
            history.pushState(null, null, location.origin + link);
            router(ROUTER_CONTAINER);
        };

        return {
            name: 'Router',
            init: init,
            routeto: routeto,
            _style: '',
            set style(style) {
                this._style = style;
            },
            /**
             * Inserts router container to swap out router components
             * for Events invoking 'routeto'.
             * 
             * @param {Object} style prop value pairs of camel cased, dashed css 
             * @returns {String} router container to swap out router components
             */
            get markup() {
                var routerStyle = Style({
                    position: 'absolute',
                    textAlign: 'center',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgb(113, 47, 242)'
                });
                var style = this._style ? this._style : routerStyle;
                return '<div id="${container}" style="${style}"></div>'.$({
                    container: ROUTER_CONTAINER,
                    style: style
                })
            }
        };
    })();


    /**
     * Inline Style creator, uses camel casing object literals
     * and converts them to standard css dashed conventions.
     *
     * @param {object} style property, value object literal using camel casing 
     * @returns {String} inline css style string
     */
    var Style = function(style) {
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
    var State = function(reducer, state) {
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
        this.markup = '<div id="app-switch"></div>';
        var state = {};
        var routes = JSON.parse(this.props.routes);
       
        window.onpopstate = function() {
            if (!this.window.history.state) {
                document.getElementById('app-switch').innerHTML = '';
                state = {};
                return;
            }
            state = this.window.history.state.route;
            var comp = routes[state];
            comp = new window[comp]().markup;
            document.getElementById('app-switch').innerHTML = comp;
        };

    };

    Link.prototype = new Component;
    function Link() {
        this.markup = ('<a href="${to}" ${attr} onclick="${handler}">${name}</a>').$({
            to: this.props['to'],
            attr: Attr(this.props['attr']),
            handler: function(event) {
                console.log('handler');
                event.preventDefault();
                var route = event.target.href.slice(event.target.href.indexOf('/', 7));
                this.window.history.pushState({ route: route }, '', route);
                this.window.dispatchEvent(new Event('popstate'));
            },
            name: this.props['name'],
        });
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
        Link: Link
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
// used for node.js testing
global.Freedactive = Freedactive;
global.State = State;
global.Style = Style;
global.Router = Router;
global.Component = Component;