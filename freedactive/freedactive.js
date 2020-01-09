/**
 * Main module hiding all functions from user except 'init'
 */
var Freedactive = (function() {

    // starting component containing user's app
    var App;

    /**
     * Initializes user's application indicating the
     * starting function.
     * 
     * @param {Function} root functional component 
     */
    var init = function(root) {
        App = root;
        router('app-container', {
            '/': App
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
    var router = function (root, routes) {
        var container = null || document.getElementById(root);
        var url = Utils.parseUrl();
        var currentRoute = routes[url] ? routes[url]() : null;
        
        // if route is unknown just load from 'App' component
        if (currentRoute === null)
            currentRoute = App();

        // prevents page reloads when using Router if 'App' is the route 
        if (root === 'app-router-container' && routes[url].name === 'App') {
            container.innerHTML = '';
            return;
        } else {
            // sets container with current route's markup
            container.innerHTML = currentRoute.getMarkup();
        }
    
        // loads scripts and styles for child components of current route
        currentRoute.getChildren().map(function(child) {
            Utils.scriptAndStyle(container, Utils.getMethodsAndStyle(child(), props), child());
        });
    
        // loads scripts and styles for current route
        Utils.scriptAndStyle(container, Utils.getMethodsAndStyle(currentRoute, props), currentRoute);
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
                    // function body without '=>'
                    var funcBody = userMethods[method].toString();
                    funcBody = funcBody.replace('=>', '');
                    // function signature, everything before first '('
                    var sig = funcBody.slice(0, funcBody.indexOf('{'));
                    sig = sig.replace('=>', '');
                    sig = sig.slice(0, funcBody.indexOf('('));
            
                    var func = 'function';
                    var asy = 'async';
                    var f = sig.indexOf(func);
                    var a = sig.indexOf(asy);
                    // if method has keyword 'function'
                    if (f > -1) {
                        funcBody = funcBody.splice(f + func.length, 0, ' ' + method + ' ');
                    } else {
                        // if method is an arrow function
                        // normal arrow function
                        if (a < 0) { 
                            funcBody = funcBody.splice(0, 0, 'function ' + method + ' ');
                        } else {
                            // async arrow function
                            funcBody = funcBody.splice(a + asy.length, 0, ' function ' + method + ' ')
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
                var scriptCode = Utils.aton(userMethods);
                var js = document.createElement('script');
                js.type = 'text/javascript';
                js.appendChild(document.createTextNode(scriptCode));
                container.appendChild(js);
            }

            // insert user component style as a link
            if (component.getStyle()) {
                var linkStyle = document.createElement('link');
                linkStyle.type = 'text/css';
                linkStyle.rel = 'stylesheet';
                linkStyle.href = component.getStyle();
                container.appendChild(linkStyle);
            }
        };

        return {
            parseUrl: parseUrl,
            aton: aton,
            scriptAndStyle: scriptAndStyle,
            getMethodsAndStyle: getMethodsAndStyle
        };

    })();


    var components = {};
    /**
     * Allows for routing in an SPA
     * 
     * @param {Object} comps { path: component } pairs
     */
    var Router = function(comps) {
        components = comps;

        var style = Style({
            position: 'relative',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%'
        });

        return '<div id="app-router-container" style="' + style + '"></div>';
    };

    /**
     * Event listener for route changes. Should be registered with
     * html element such as a button, li, etc.
     * 
     * @param {string} link the specified route to listen for 
     */
    var routeto = function(link) {
        history.pushState(null, null, location.origin + link);
        router('app-router-container', components);
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
var Router = function(components) {
    return Freedactive.Router.init(components);
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
