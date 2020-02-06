# ![Alt text](/examples/hello-world/assets/favicon.png?raw=true) Freedactive &middot; ![Build Status](https://travis-ci.com/steven-freed/freedactive.svg?branch=master) ![npm version](https://img.shields.io/npm/v/freedactive.svg?style=flat-square)(https://www.npmjs.com/package/freedactive)
*The Single Page Application Framework for Frontend JavaScript Developers, Batteries Included*

## Purpose?
Freedactive is a light weight all in one (batteries included) framework with no package manager requirements to allow for a quick easy set up to create great Single Page Web Applications. Freedactive supports ES5 as well as ES6 syntax, the choice is yours!
Get started now below, happy coding!

*Tired of coding out components and other files?*\
Try downloading the freedactive-cli to quickly serve apps, auto create components and projects, and more.\
https://www.npmjs.com/package/freedactive-cli
```
$ npm install -g freedactive-cli
```

## Quick Start

### Quick Start ES5
*(older, more widely supported syntax)*

Create an index.html file and an App.js file
1. import the Freedactive framework
2. import your entry component (e.g. App.js) and all other components you've created
3. create div with id "app-container"
4. initialize Freedactive in your entry component
5. run server; copy our 'dev-server.js' node server code or use freedactive-cli to serve your web app
 
index.html
```html
<!DOCTYPE html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
        <title>My App</title>
        
        <!-- 1 -->
        <script src="https://steven-freed.github.io/freedactive/freedactive.min.js"></script>
        
        <!-- 2 -->
        <script src="/src/App.js"></script>
    </head>
    <body>
        <!-- 3 -->
        <div id="app-container"></div>
    </body>
</html>
```

App.js
```js
App.prototype = new Component;

function App() {
    this.markup = ('\
        <div>\
            <h1>Welcome to Freedactive!</h1>\
        </div>\
    ');
    this.style = './src/App.css';
}

/**    4    **/
Freedactive.init(App);
```

Terminal
```
/**    5    **/
$ node dev-server.js
OR
$ freedactive serve
```

### Quick Start ES6
*(newer, easier, not as widely supported syntax)*

Create an index.html file and an App.js file
1. import the Freedactive framework
2. import your entry component only (e.g. App.js)
3. create div with id "app-container"
4. initialize Freedactive in your entry component
5. run server; copy our 'dev-server.js' node server code or use freedactive-cli to serve your web app

index.html
```html
<!DOCTYPE html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
        <title>My App</title>
        
        <!-- 1 -->
        <script src="https://steven-freed.github.io/freedactive/freedactive.min.js"></script>
        
        <!-- 2 -->
        <script src="/src/App.js" type="module"></script>
    </head>
    <body>
        <!-- 3 -->
        <div id="app-container"></div>
    </body>
</html>
```

App.js
```js
export default class App extends Component {
    constructor() {
        super();
        this.markup = (`
            <div>
                <h1>Welcome to Freedactive!</h1>
            </div>
        `);
        this.style = './src/App.css';
    }

}

/**    4    **/
Freedactive.init(App);
```

Terminal
```
/**    5    **/
$ node dev-server.js
OR
$ freedactive serve
```

**Note: If using your own server, Freedactive requires that your server must always serve the index.html file**

## Contributions
If you are interested in contributing to Freedactive please submit a pull request indicating your reason for contribution as well as tests for your contribution.

## Documentation

Freedactive documentation follows the ES5 syntax because it is more widely accepted
on the web. However you may use ES6 syntax too, it is supported by many browsers today.\
ES6 example https://github.com/steven-freed/freedactive/tree/master/examples/js-modules

### API
***ES5 Strings***\
Strings in Freedactive are like normal ES5 strings (single and double quotes).
To overcome the messy string interpolation of ES5, Freedactive extends the String
prototype by adding the 'cash' method to allow for ES6 backtick *like* string
interpolation. The cash function also relieves you from needing to escape quotes
if using them in variables.

```js
// example
var freedactive = "Freedactive";
var html = ('<div>Welcome to ${name}!</div>').$({
    name: freedactive
});
// expected output: '<div>Welcome to Freedactive!</div>'

// example - no need to escape quotes
var html = ('<button onclick="${handler}"></button>').$({
    handler: alert("Single quotes ' can be used here")
});
```

unfortunately we do still need to use backslashes for multi-line strings for
our components returned markup.

***Router***\
Router is a singleton that provides SPA routing to your application.

```js
/**
* Initializes the component Router.
* 
* @param {Object} comps path, component pairs to initialize router
*/
Router.init(comps)

/**
 * Gets and Sets Router container's markup
 */
Router.markup

/**
 * Event listener for route changes. Should be registered with
 * html element such as a button, li, etc.
 * 
 * @param {String} link the specified route to listen for 
 */
Router.routeto(link)

// example
var markup = ('<button onclick="Router.routeto(${path})"></button>').$({ path: '/my-path' });
```

***Style***\
Style provides a translation from an object literal containing { prop: value } pairs where
prop is a camel cased css property and value is a normal css value as a string.

```js
/**
 * Inline Style creator, uses camel casing object literals
 * and converts them to standard css dashed conventions.
 *
 * @param {Object} style property, value object literal using camel casing 
 * @returns {String} inline css style string
 */
Style(style)
```

***State***\
State instances are created by passing them a reducer function.

```js
/**
 * State managment
 * 
 * @param {Function} reducer reducer function
 * @param {Object} initState optional starting state 
 */
var state = new State(reducer, initState);

/**
 * Gets the current state for your instance
 * 
 * @returns your instances state
 */
state.getState();

/**
 * Publishes an action to your state instance
 * 
 * @param {Object} action your action
 * @returns {Object} your action
 */
state.pub(action);

/**
 * Subscribes your state instance to a callback
 * event handler.
 * 
 * @param {Function} eventHandler your listener for publishes
 */
state.sub(eventHandler);
```

### Components
*Theory*
* Components in Freedactive are first class functions, meaning that functions
are treated like variables or objects
* Components inherit from the Freedactive Component object

*Component*
* constructor - the function itself creating the component (e.g. function Test())
* private - variables or methods declard with var inside a function (var is function scoped)
* public - variables or methods declared using this inside a function

```js
// inherit properties from Component
Test.prototype = new Component;

// component
function Test() {
    /* constructor */

    /* properties */
    // public
    this.publicVariable = 6;
    this.publicFunc = function() { }
    // calls the markup setter of Component
    this.markup = ('\
        <div>Freedactive</div>\
    ');

    // private
    var privateVariable = 7;
    var privateFunc = function() { }

    /* constructor */
}
```

***Component Properties***\
These properties are populated to your component when you inherit from the Component object.
The following properties contain getters and setters in the Component object. When you set
one of the properties to a value, you are in fact invoking that properties' setter in the
Component object. Likewise when you access one of these properties you are invoking that
properties' getter in the Component object.

* markup - a string of the components html content
* style - the path to your style sheet for that component
* children - any components being used in the markup of the component

```js
App.prototype = new Component;

function App() {
    this.markup = ('
        <div>\
            <h1>Welcome to Freedactive!</h1>\
        </div>\
    ');
    this.style = './App.css';
    this.children = [
        CustomButton,
        CustomView
    ];
}
```

***Using Components in Components***\
Using a component in another component is simple, we can use Freedactives
string 'cash' method to insert a component's markup into another components
markup. First we must invoke our components constructor 'new MyButton()' to obtain
our components public properties, next we access our 'markup' property to
insert our 'MyButton' component's html 'new MyButton().markup'. 

```js
MyButton.prototype = new Component;

function MyButton() {
    this.markup = ('
        <div>\
            <button>MyButton</button>\
        </div>\
    ');
    this.style = './MyButton.css';
}
```

```js
App.prototype = new Component;

function App() {
    this.markup = ('
        <div>\
            <h1>Welcome to Freedactive!</h1>\
            ${customButton}\
        </div>\
    ').$({
        customButton: new MyButton().markup
    });
    this.style = './App.css';
    this.children = [
        MyButton
    ];
}
```

### Styles
***Inline Styles***\
Freedactive inline styles are very similar to React's inline styles. You use
camel casing of normal css attributes for keys and normal css values for values.
*Note that Styles is a function rather than an object so we do not want to use new when creating an inline style*

```js
App.prototype = new Component;

function App() {
    var headerStyle = Style({
        color: 'blue'
    });

    this.markup = ('
        <div>\
            <h1 style=${style}>Welcome to Freedactive!</h1>\
        </div>\
    ').$({
        style: headerStyle
    });
}
```

### Routing
***Router Object***\
Navigation is a big concern in SPAs. With Freedactive you get the framework, batteries included.
You first call 'Router.init' to set the routes and their corresponding component. Then use the 'Router.
routeto' method for the event of your choice to cause that route to be executed.
*Note when using the Router object you do not need to include your routing components in the children array of your component (NavBar)*

```js
NavBar.prototype = new Component;

function NavBar() {

    // Sets your routes
    Router.init({
        '/': App,
        '/docs': Docs,
        '/hello': Hello,
        '/hello/world': World
    });

    // navbar navigation
    var navbarRoutes = {
        '/': App,
        '/docs': Docs,
        '/hello': Hello
    };

    /**
     * Create the navbar list items.
     * Have the onclick event call Router.routeto('/yourPath')
     * to display the corresponding component.
     * 
     * @note the 'cash' method being used so you
     * don't have to escape single or double quotes 
     * for 'key', the parameter of 'Router.routeto'.
     */
    var lis = Object.keys(navbarRoutes).map(function(k) {
        return ('<li onclick="Router.routeto(${key})">${route}</li>').$({
            key: "'${yourPath}'".$({ yourPath: k }),
            route: routes[k].name
        });
    });

    /**
     * Place the router's markup 'Router.markup' where you
     * want to display your components when 'Router.routeto' is called.
     */
    this.markup = ('\
        <div>\
            <ul>\
                ${items}\
            </ul>\
            <span></span>\
        </div>\
        ${Router}\
    ').$({
        items: lis.map(function(li) { return li; }).join(""),
        Router: Router.markup
    });
}
```

### Events
***Event Handlers***\
Event handlers for components in Freedactive are just component methods.

```js
HelloWorld.prototype = new Component;

function HelloWorld() {
    /**
    *   public method notify to handle onclick event
    */
    this.notify = function() {
        // any DOM manipulation goes here
        alert('Hello World!');
    }

    this.markup = ('
        <div>\
            <button onclick="notify()">Press Here</button>\
        </div>\
    ');
}
```

### State
Freedactive offers a simple interface to state management.

***Actions***\
*Action Types*: different types of actions
```js
var Type = {
    INCREMENT: 'INCREMENT',
    DECREMENT: 'DECREMENT'
};
```

*Action Creators*: helper functions to create new actions if those actions take parameters
```js
var Creator = (function() {
    function incrementCounter() {
        return { type: Type.INCREMENT };
    };

    function decrementCounter() {
        return { type: Type.DECREMENT };
    };

    return {
        incrementCounter,
        decrementCounter
    };
})();
```

***Reducers***\
*Reducers*: changes the state of your instance given the current state and an action
```js
var Reducer = (function() {

  function counter(state, action) {
      if (typeof state === 'undefined')
        return 1;
      switch (action.type) {
        case Type.INCREMENT:
          return state + 1;
        case Type.DECREMENT:
          return state - 1;
        default:
          return state;
      }
  };

  return {
    counter
  };
})();
```

Action Types, Action Creators, and Reducers SHOULD BE KEPT in a self invoking function to reduce
clutter in the global namespace. They should be accessed like so...
```js
Reducer.counter;
Type.INCREMENT;
Creator.incrementCounter;
```

***Methods***\
*sub*: subscribes an event handler function to execute when a state change for your instance occurs\
*pub*: publishes an action to change the state of your state instance and invoke your subscribers\
*getState*: retrieves the current state of your state instance

Please see https://github.com/steven-freed/freedactive/tree/master/examples/state-management for a full example.

### PWA/HTML Apps
***Service Workers***\
Please see https://github.com/steven-freed/freedactive/tree/master/examples/service-worker for an example
using service workers.

# ![Alt text](/examples/hello-world/assets/favicon.png?raw=true) Freedactive CLI
Freedactive CLI for creating projects, components, serving your web apps and more.

## Commands
- **create**: creates a boilerplate project given a name\
**args**\
project: your projects name
```
$ freedactive create MyApp
```

- **component**: creates the JavaScript function with methods for your component, as well as the style
css file for your component.\
**args**\
name: your components name
```
$ freedactive component CustomButton
```

- **serve**: serves your web app from your working directory (should be ran where your index.html file is located)\
**flags**\
-p: port number, defaults to port 8080
```
MyApp$ freedactive serve
MyApp$ freedactive serve -p 3000
```