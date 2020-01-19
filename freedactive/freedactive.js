/**
 * JavaScript Polyfills
 */

// extends strings to include splice
String.prototype.splice = function(start, remove, str) {
    return this.slice(0, start) + str + this.slice(start + Math.abs(remove));
};

// support for string interpolation like backticks
// use ${} to insert your variable into a string
//
// ex. 'Hello ${x}'.$({ x: 'World' }) = 'Hello World'
String.prototype.$ = function (vars) {
    return this.replace(/\${([^${}]*)}/g, function (a, b) {
            return typeof vars[b] === 'string' || typeof vars[b] === 'number' ? vars[b] : a;
        });
};

/**
 * Main module exposing a subset of public API methods
 */
var Freedactive = (function() {

    var APP_CONTAINER = 'app-container';            // app root container
    var ROUTER_CONTAINER = 'app-router-container';  // router container
    var ENTRY_COMPONENT = 'App';                    // entry component identifier
    var App;                                        // entry component
    var components = {};                            // router components store
    var props = [                                   // component props
        'getMarkup',  // required
        'getStyle',   // required
        'getChildren' // optional
    ];

    /**
     * Initializes user's application by setting the 
     * 'load' event listener and 'popstate' event listener.
     * 
     * @param {Function} root functional component 
     */
    function init(root) {
        App = root;
        ENTRY_COMPONENT = root.name ? root.name : ENTRY_COMPONENT;
        components['/'] = App;
        
        window.addEventListener('load', function() {
            router(APP_CONTAINER);
        });
        
        window.onpopstate = function() {
            Router.routeto(Utils.parseUrl());
        };
    };

    /**
     * Routes SPA by loading entry component and its children on 'load' event
     * and loading url related component in Router on 'routeto' invocations. 
     * 
     * @param {String} root name of component container to be swapped during route changes
     */
    function router(root) {
        // set up mutation observer to observe if 'app-router-container'
        // is added to DOM. This allows for displaying the correct component
        // for the corresponding url.
        function callback() {
            if (document.getElementById(ROUTER_CONTAINER)) {
                router(ROUTER_CONTAINER);
                observer.disconnect();
            }
        }
        var observer = new MutationObserver(callback);
        observer.observe(document.getElementById(APP_CONTAINER), { 
            childList: true,
        });

        // get current component
        var container = null || document.getElementById(root);
        var url = Utils.parseUrl();
        var rt = components[url] ? new components[url]() : null;

        // if route is unknown just load 'ENTRY_COMPONENT' component
        if (!rt) 
            rt = new App();

        // prevents page reloads when using Router if ENTRY_COMPONENT is the route 
        if (components[url] && root === ROUTER_CONTAINER && components[url].name === ENTRY_COMPONENT) {
            container.innerHTML = '';
            return;
        } else {
            // sets container with current route's markup
            try {
                container.innerHTML = rt.getMarkup();
            } catch (e) {
                throw new Error('Component ${component} does not appear to contain\
                the "getMarkup" property.'.$({ component: components[url].name }));
            }
        }

        // loads scripts and styles for child components of current route
        if (rt.hasOwnProperty('getChildren')) {
            rt.getChildren().map(function(child) {
                child = new child();
                Utils.scriptAndStyle(container, Utils.getMethods(child, props), child);
            });
        }
    
        // loads scripts and styles for current route
        Utils.scriptAndStyle(container, Utils.getMethods(rt, props), rt);
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
                }).join(';');
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
                component.hasOwnProperty('getStyle') &&
                !document.getElementById(component.getStyle()) &&
                component.getStyle() !== ''
                ) {
                var styleLink = document.createElement('link');
                styleLink.type = 'text/css';
                styleLink.rel = 'stylesheet';
                styleLink.id = component.getStyle();
                // calculates directory of css by going back by 
                // number of slashes in url
                var dir = Utils.parseUrl().split("/").length - 1;
                var dirUp = "";
                while (--dir) dirUp += ".";
                styleLink.href = dirUp + component.getStyle();
                document.head.appendChild(styleLink);
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
         * Inserts router container to swap out router components
         * for Events invoking 'routeto'.
         * 
         * @param {Object} style prop value pairs of camel cased, dashed css 
         * @returns {String} router container to swap out router components
         */
        function getMarkup(style) {
            var routerStyle = Style({
                position: 'absolute',
                textAlign: 'center',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgb(113, 47, 242)'
            });
            style = style ? style : routerStyle;
            return '<div id="${container}" style="${style}"></div>'.$({
                container: ROUTER_CONTAINER,
                style: style
            });
        };

        /**
         * Initializes the component Router.
         * 
         * @param {Object} comps path, component pairs to initialize router
         */
        function set(comps) {
            Object.assign(components, comps);
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
            set: set,
            getMarkup: getMarkup,
            routeto: routeto
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
    };
})();

/**
 * Pubic API
 */

// Router
var Router = Freedactive.Router;

// Style
var Style = function(style) {
    return Freedactive.Style(style);
};

// State
var State = Freedactive.State;

// used for node.js testing
//module.exports = Freedactive;