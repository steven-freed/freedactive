/**
 * Main module hiding all functions from user except 'init'
 */
var Freedactive = (function() {

    // starting component containing user's app
    var APP_CONTAINER = 'app-container';
    var ROUTER_CONTAINER = 'app-router-container';
    var ENTRY_COMPONENT = 'App';
    var App;
    var components = {};

    /**
     * Initializes user's application indicating the
     * starting function.
     * 
     * @param {Function} root functional component 
     */
    var init = function(root) {
        App = root;
        ENTRY_COMPONENT = root.name ? root.name : ENTRY_COMPONENT;
        components['/'] = App;
        window.addEventListener('load', function() {
            router(APP_CONTAINER);
        });
    }

    // Freedactive component properties
    var props = [
        'style',
        'getMarkup',
        'getStyle',
        'getChildren'
    ];

    /**
     * Routes SPA by parsing url and loading scripts and styles
     * for route related component and its children.
     * 
     * @param {string} root name of component container to be swapped during route changes
     * @param {Object} routes { path: component } pairs
     */
    var router = function (root) {
        // set up mutation observer to observe if 'app-router-container'
        // is added to DOM. This allows for displaying the correct component
        // for the corresponding url.
        var callback = function() {
            if (document.getElementById(ROUTER_CONTAINER)) {
                router(ROUTER_CONTAINER);
                observer.disconnect();
            }
        }
        var observer = new MutationObserver(callback);
        observer.observe(document.getElementById(APP_CONTAINER), { 
            //attributes: false,
            childList: true,
            //characterData: false,
            //subtree: true
        });

        var container = null || document.getElementById(root);
        var url = Utils.parseUrl();
        var rt = components[url] ? components[url]() : null;

        // if route is unknown just load from 'ENTRY_COMPONENT' component
        if (rt === null) 
            rt = App();

        // prevents page reloads when using Router if ENTRY_COMPONENT is the route 
        if (root === ROUTER_CONTAINER && components[url].name === ENTRY_COMPONENT) {
            container.innerHTML = '';
            return;
        } else {
            // sets container with current route's markup
            container.innerHTML = rt.getMarkup();
        }
    
        // loads scripts and styles for child components of current route
        rt.getChildren().map(function(child) {
            Utils.scriptAndStyle(container, Utils.getMethodsAndStyle(child(), props), child());
        });
    
        // loads scripts and styles for current route
        Utils.scriptAndStyle(container, Utils.getMethodsAndStyle(rt, props), rt);
    };


    /**
     * Utils Module
     */
    var Utils = (function() {

        /**
         *  Parses the url
         */
        var parseUrl = function () {
            var url = location.href;
            url = url.slice(url.indexOf('/', 8));
            return url;
        };

        /**
         * Converts anonymous functions and arrow functions
         * to traditional named fuctions. Works for async functions
         * as well.
         * 
         * @param {Array} userMethods methods of any kind
         */
        var aton = function (userMethods) {
            return Object.keys(userMethods).map(function(method) {
                    var FUNCTION = 'function';
                    var ASYNC = 'async';
                    var ARROW = '=>';
                    // function body without '=>'
                    var funcBody = userMethods[method].toString();
                    funcBody = funcBody.replace(ARROW, '');
                    // function signature, everything before first '('
                    var sig = funcBody.slice(0, funcBody.indexOf('{'));
                    sig = sig.replace(ARROW, '');
                    sig = sig.slice(0, funcBody.indexOf('('));
            
                    var f = sig.indexOf(FUNCTION);
                    var a = sig.indexOf(ASYNC);
                    // if method has keyword 'function'
                    if (f > -1) {
                        funcBody = funcBody.splice(f + FUNCTION.length, 0, ' ' + method + ' ');
                    } else {
                        // if method is an arrow function
                        // normal arrow function
                        if (a < 0) { 
                            funcBody = funcBody.splice(0, 0, FUNCTION + ' ' + method + ' ');
                        } else {
                            // async arrow function
                            funcBody = funcBody.splice(a + ASYNC.length, 0, ' ' + FUNCTION + ' ' + method + ' ')
                        }
                    }
                
                    return funcBody;
                }).join(' ');
        };

        /**
         * Returns a component copy containing ONLY user
         * defined public methods and the 'style' property.
         * 
         * @param {Function} component user defined component
         */
        var getMethodsAndStyle = function (component, props) {
            var componentProps = Object.assign({}, component);
            Object.keys(componentProps).map(function(prop) {
                if (props.includes(prop) && prop !== 'style')
                    delete componentProps[prop];
                if (typeof(componentProps[prop]) !== 'function' && prop !== 'style')
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
        var scriptAndStyle = function (container, userMethods, component) {
            // insert user component methods as a script
            if (Object.keys(userMethods).length) {
                var methodsScript = Utils.aton(userMethods);
                var js = document.createElement('script');
                js.type = 'text/javascript';
                js.appendChild(document.createTextNode(methodsScript));
                container.appendChild(js);
            }

            // insert user component style as a link if...
            // link with href = css path of functional component does not exist,
            // component has a style
            if (!document.querySelector('[href="' + component.getStyle() + '"]') && component.getStyle()) {
                var styleLink = document.createElement('link');
                styleLink.type = 'text/css';
                styleLink.rel = 'stylesheet';
                styleLink.href = component.getStyle();
                document.head.appendChild(styleLink);
            }
        };

        return {
            parseUrl: parseUrl,
            aton: aton,
            scriptAndStyle: scriptAndStyle,
            getMethodsAndStyle: getMethodsAndStyle
        };

    })();

    /**
     * Routes different components to different routes.
     * 
     * @param {Object} comps components to assign to different routes
     * @param {Object} style router style
     */
    var Router = function(comps, style) {
        components = comps;
        return '<div id="' + ROUTER_CONTAINER + '" style="' + style + '"></div>';
    };

    /**
     * Event listener for route changes. Should be registered with
     * html element such as a button, li, etc.
     * 
     * @param {string} link the specified route to listen for 
     */
    var routeto = function(link) {
        history.pushState(null, null, location.origin + link);
        router(ROUTER_CONTAINER);
    }

    /**
     * Inline Style creator, uses camel casing object literals
     * and converts them to standard css dashed conventions.
     *
     * @param {object} style property, value object literal using camel casing 
     */
    var Style = function(style) {
        var styleList = Object.keys(style).map(function(key) {
            var dashed = key.replace(/[A-Z]/g, function(m) {
                return '-' + m.toLowerCase();
            });
            return dashed + ':' + style[key] + ';';
        });
        return styleList.join('');
    };

    // user accessible props
    return {
        init: init,
        Router: {
            init: Router,
            routeto: routeto
        },
        Style: {
            init: Style
        }
    };

})();

/**
 * Pubic API
 */

// Router
var Router = function(comps, style) {
    var routerStyle = Style({
        position: 'relative',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%'
    });
    return Freedactive.Router.init(comps, style ? style : routerStyle);
}

var routeto = function(link) {
    return Freedactive.Router.routeto(link);
}

// Style
var Style = function(style) {
    return Freedactive.Style.init(style);
}

// extends strings to include splice
String.prototype.splice = function(start, remove, str) {
    return this.slice(0, start) + str + this.slice(start + Math.abs(remove));
};
