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
                    return '(' + values[i].toString() + ')();';
                case 'string':
                    return values[i];
                case 'number':
                    return values[i];
                default:
                    return a;
            }
        } else {
            switch(typeof(vars[b])) {
                case 'function':
                    return '(' + vars[b].toString() + ')();';
                case 'string':
                    return vars[b];
                case 'number':
                    return vars[b];
                default:
                    return a;
            }
        }
    });
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
    var components = {};                            // components store
    
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
     */
    String.prototype._JSX = function _JSX() {
        // sets router in components so that it can be
        // rendered in JSX strings
        components['_router'] = Router; 
        var html = this.toString();
        var jsxComponents = {};

        // sets the component's markup whose markup is 'this'
        // strings context 
        (function setMarkup(context) {
            // finds all JSX component declarations in markup
            for (var c of Object.keys(components)) {
                // if component name is null, skip it
                if (!components[c].name) continue; 
                var regex = new RegExp('<' + components[c].name + '.*?\/>', 'gms');
                var matches = context.match(regex);
                // if no matches exist
                if (!matches) continue;
                if (components[c].name !== ENTRY_COMPONENT) {
                    if (typeof components[c] === 'function') {
                        html = context.replace(regex, new components[c]().markup);
                    } else {
                        html = context.replace(regex, components[c].markup);
                    }
                    setMarkup(html);
                }
                // maps indices of JSX components to JSX component strings
                matches.map(function(val) {
                    jsxComponents[context.indexOf(val)] = val; 
                });
            }
        })(this.toString());

        (function setProps() {
            // populates properties of component
            for (var c in jsxComponents) {
                var CLOSING_TAG = '/>';
                var DELIMETER = ';';
                var indexOfComp = jsxComponents[c].search(/\s/ms);
                var component = jsxComponents[c].slice(1, indexOfComp);
                component = window[component];
                if (component === undefined) continue;
                var propStr = jsxComponents[c].slice(indexOfComp);
                propStr = propStr.replace(CLOSING_TAG, '');
                propStr = propStr.replace(/\s+/gms, DELIMETER);
                // removes first and last delimeter if they exist
                if (propStr[0] === DELIMETER) propStr = propStr.slice(1);
                if (propStr[propStr.length - 1] === DELIMETER) propStr = propStr.slice(0, propStr.length - 1);
                // turns props into array of strings
                propStr = propStr.includes(DELIMETER) ? propStr.split(DELIMETER) : [];
                // turns props strings into object prop key, val pairs
                var props = {};
                for (var p of propStr) {
                    var firstQuote = p.indexOf('"');
                    var key = p.slice(0, p.indexOf('='));
                    var val = p.slice(firstQuote + 1, p.length - 1);
                    props[key] = val;
                }
                // sets props property for component
                if (typeof component === 'function') component.prototype.props = props;
            }
        })();

        return html;
    };

    /**
     * Component Prototype to inherit from
     */
    var Component = function Component() {
        this._markup = '';
        this._style = '';
        this._props = {};
        // sets the routing component, component with Router.init inside it
        this._router = null; 
        // for router to run '_JSX' function on markup
        this._jsx = function(component) {
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
     * Style is the location of your style sheet
     */
    Object.defineProperty(Component.prototype, 'style', {
        set: function(style) {
            this._style = style;
        },
        get: function() {
            return this._style;
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
     * Router is set ideally in the entry component 'App'
     * and only provides a setter
     */
    Object.defineProperty(Component.prototype, 'router', {
        set: function(router) {
            components['_navigation'] = router;
            this._router = router
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
    function init(root, comps, options) {
        if (options === undefined) {
            options = {};
        }
        App = root;
        ENTRY_COMPONENT = root.name ? root.name : ENTRY_COMPONENT;
        components['/'] = App;

        importScripts(comps, options.modules ? options.modules : false, function(err) {
            if (err) {
                throw err;
            } else {
                window.addEventListener('load', function() {
                    router(APP_CONTAINER);
                });
                
                window.onpopstate = function() {
                    Router.routeto(Utils.parseUrl());
                };
            }
        });
    };

    /**
     * Turns all paths of non-entry components into
     * script tags so user doesn't need to touch html.
     * 
     * @param {Array} comps all non-entry components
     * @param {function} cb callback to start router when done
     */
    function importScripts(comps, modules, cb) {
        if (!comps || comps.length === 0) return cb(new Error('Missing Component imports.'));
        for (var path of comps) {
            var script = document.createElement('script');
            script.src = path;
            if (modules) script.type = 'module';
            document.head.appendChild(script);
            setTimeout(function() {
            }, 100);
        }
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
                if (!rt && url !== '/') { 
                    rt = new App();
                    rt._jsx(rt);
                    container.innerHTML = rt.markup;
                    router(ROUTER_CONTAINER);
                } else {
                    // routes are known and we can load routed component
                    rt._jsx(rt);
                    container.innerHTML = rt.markup;
                }
            } catch (e) {
                throw e;
            }
        }

        // loads scripts and styles for routing component
        if (rt._router) {
            var _router = new rt._router();
            Utils.scriptAndStyle(container, Utils.getMethods(_router, Object.getOwnPropertyNames(Component.prototype)), _router);
        }
    
        // loads scripts and styles for current route
        Utils.scriptAndStyle(container, Utils.getMethods(rt, Object.getOwnPropertyNames(Component.prototype)), rt);
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
        var reqs = {}; // keeps track of files requested so requests are not repeated
        function scriptAndStyle(container, userMethods, component) {
            // insert user component methods as a script
            if (Object.keys(userMethods).length) {
                var methodsScript = Utils.aton(userMethods);
                var js = document.createElement('script');
                js.type = 'text/javascript';
                js.appendChild(document.createTextNode(methodsScript));
                container.appendChild(js);
            }

            // insert user component style as a link if component
            // style does not exist already
            if (
                component._style !== undefined &&
                !document.getElementById(component._style) &&
                component._style !== ''
                ) {
                // calculates directory of css by going back by 
                // number of slashes in url
                var dir = Utils.parseUrl().split("/").length - 1;
                var fileloc = "";
                while (--dir) fileloc += ".";
                fileloc += component._style;

                if (reqs[fileloc]) return;

                // check if css file exists before linking
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function() {
                    var resHdr = this.getResponseHeader('content-type');
                    if (!resHdr) return;
                    var type = resHdr.slice(0, resHdr.indexOf(';'));
                    if (type.includes('css')) {
                        var styleLink = document.createElement('link');
                        styleLink.type = 'text/css';
                        styleLink.rel = 'stylesheet';
                        styleLink.id = component._style;
                        styleLink.href = fileloc;
                        document.head.appendChild(styleLink);
                    }
                    reqs[fileloc] = true;
                };
                xhr.open('HEAD', fileloc);
                xhr.send();
            }
        };

        return {
            parseUrl: parseUrl,
            aton: aton,
            scriptAndStyle: scriptAndStyle,
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


    /**
     * Public API methods
     */
    return {
        init: init,
        Router: Router,
        Style: Style,
        State: State,
        Component: Component
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

// used for node.js testing
/*
global.Freedactive = Freedactive;
global.State = State;
global.Style = Style;
global.Router = Router;
global.Component = Component;*/