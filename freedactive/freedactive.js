import App from '../src/App.js';

// Freedactive component properties
const props = [
    'style',
    'getMarkup',
    'getStyle',
    'getChildren'
];

/**
 * 
 * @param {string} root name of container to be swapped out between routes
 * @param {Object} routes path, functional component pairs
 */
const router = async function (root, routes) {
    
    const container = null || document.getElementById(root);
    let req = parseRequestURL();
    let parsedURL = (req.resource ? '/' + req.resource : '/') + 
        (req.id ? '/:id' : '') + 
        (req.verb ? '/' + req.verb : '');

    let route = routes[parsedURL] ? routes[parsedURL]() : null;
    // if route is unknown just load from 'App' component
    if (route === null) 
        route = App();

    if (root === "app-router-container" && routes[parsedURL].name === 'App') {
        container.innerHTML = "";
        return;
    } else {
        container.innerHTML = await route.getMarkup();
    }
   
    // loads scripts and styles for child components
    await route.getChildren().map((child) => {
        scriptAndStyle(container, getMethodsAndStyle(child()), child());
    });
   
    // loads scripts and styles for current component
    await scriptAndStyle(container, getMethodsAndStyle(route), route);
};

// Initialized App
window.addEventListener('load', function() {
    router("app-container", {
        '/': App
    });
});

/**
 *  Parses url with fragmentation identifier
 */
const parseRequestURL = function () {
    let url = location.hash.slice(1).toLowerCase() || '/';
    let r = url.split('/');
    let req = {
        resource: null,
        id: null,
        verb: null
    };
    req.resource = r[1];
    req.id = r[2];
    req.verb = r[3];

    return req;
};

/**
 * Converts anonymous functions and arrow functions
 * to traditional named fuctions. Works for async functions
 * as well.
 * 
 * @param {Array} userMethods methods of any kind
 */
const anonToFuncs = function (userMethods) {
    return Object.keys(userMethods).map((method) => {
            // function body without '=>'
            let funcBody = userMethods[method].toString();
            funcBody = funcBody.replace("=>", "");
            // function signature, everything before first '('
            let sig = funcBody.slice(0, funcBody.indexOf("{"));
            sig = sig.replace("=>", "");
            sig = sig.slice(0, funcBody.indexOf("("));
    
            let f = sig.indexOf("function");
            let a = sig.indexOf("async");
            // if method has keyword 'function'
            if (f > -1) {
                funcBody = funcBody.splice(f + 8, 0, ` ${method} `);
            } else {
                // if method is an arrow function
                // normal arrow function
                if (a < 0) { 
                    funcBody = funcBody.splice(0, 0, `function ${method} `);
                } else {
                    // async arrow function
                    funcBody = funcBody.splice(a + 5, 0, ` function ${method} `)
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
const getMethodsAndStyle = function (component) {
    let componentProps = Object.assign({}, component);
    Object.keys(componentProps).map((prop) => {
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
 * @param {DOM element} container container to insert style or script
 * @param {Array} userMethods user defined public methods
 * @param {Object} component routing component
 */
const scriptAndStyle = function (container, userMethods, component) {
    // insert user component methods as a script
    if (Object.keys(userMethods).length) {
        let scriptCode = anonToFuncs(userMethods);
        let js = document.createElement('script');
        js.type = 'text/javascript';
        js.appendChild(document.createTextNode(scriptCode));
        container.appendChild(js);
    }

    // insert user component style as a link
    if (component.getStyle()) {
        let linkStyle = document.createElement('link');
        linkStyle.type = 'text/css';
        linkStyle.rel = 'stylesheet';
        linkStyle.href = component.getStyle();
        container.appendChild(linkStyle);
    }
};

/**
 * components with their paths
 * 
 * @param {Object} components 
 */
export const Router = function(components) {
    try {
        return `<div id="app-router-container"></div>`;
    } catch (e) {
        throw e;
    } finally {
        window.addEventListener('hashchange', function() {
            router("app-router-container", components);
        });
    }
};

/**
 * Inline Style creator, uses camel casing object literals
 * and converts them to standard css dashed conventions.
 *
 * @param {object} style property, value object literal using camel casing 
 */
export const Style = function (style) {
    let styleList = Object.keys(style).map((key) => {
        let dashed = key.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
        return `${dashed}:${style[key]};`;
    });
    return styleList.join("");
};

String.prototype.splice = function(start, remove, str) {
    return `${this.slice(0, start)}${str}${this.slice(start + Math.abs(remove))}`;
};
