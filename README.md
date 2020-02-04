# ![Alt text](/examples/hello-world/assets/favicon.png?raw=true) Freedactive [![Build Status](https://travis-ci.com/steven-freed/freedactive.svg?branch=master)](https://travis-ci.com/steven-freed/freedactive)
*The Single Page Application Framework for Frontend JavaScript Developers, Batteries Included*

## Purpose?
There are many great SPA frameworks such as React and Angular. Almost all of them involve
downloading many external libraries and use transpilers. The goal of Freedactive is to give
developers an easy way to say goodbye to transpilers and frameworks that require npm and many
other packages for vital functionality. Freedactive provides developers with an intuitive way
to write idiomatic ES5 syntax or ES6 syntax and get a web application up in minutes.
Freedactive is very easy to get started with and requires zero installations.\
Get started now below, happy coding!

## Quick Start ES5
*(older, more widely supported syntax)*

In your index.html file you must have: 
1. import the Freedactive framework
2. your entry component (for example App.js) and all other components you've created
3. div with id "app-container"
4. initialize Freedactive in your entry component
5. run your own server, copy our 'dev-server.js' node server code, or use freedactive-cli to serve your web app\
 
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

```js
var App = App() {
}

App.prototype = Object.create(Component.prototype);

App.prototype.getMarkup = function() {
    return ('\
        <div>\
            <h1>Welcome to Freedactive!</h1>\
        </div>\
    ');
}

App.prototype.getStyle = function() {
    return './src/App.css';
}

/**    4    **/
Freedactive.init(App);
```

```
/**    5    **/
$ node dev-server.js
```
OR
```
/**    5    **/
$ freedactive serve
```

## Quick Start ES6
*(newer, easier, not as widely supported syntax)*

In your index.html file you must have: 
1. import the Freedactive framework
2. your entry component only (for example App.js)
3. div with id "app-container"
4. initialize Freedactive in your entry component
5. run your own server, copy our 'dev-server.js' node server code, or use freedactive-cli to serve your web app\
 
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

```js
export default class App extends Component {
    getMarkup() {
        return (`
            <div>
                <h1>Welcome to Freedactive!</h1>
            </div>
        `);
    }

    getStyle() {
        return './src/App.css';
    }
}

/**    4    **/
Freedactive.init(App);
```

**Note: For both ES5 and ES6**
*- your server must always serve the index.html file*
*- if you have npm (node package manager) installed,*
*install freedactive-cli to easily serve your app*
*https://www.npmjs.com/package/freedactive-cli*
```
$ npm install -g freedactive-cli
```

### Contributions
If you are interested in contributing to Freedactive please submit a pull request indicating your reason for contribution as well as tests for your contribution.

## Documentation
### API
***Strings***\
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
Router.set(comps)

/**
 * Inserts router container to swap out router components
 * for Events invoking 'Router.routeto'.
 * 
 * @param {Object} style prop value pairs of camel cased, dashed css 
 * @returns {String} router container to swap out router components
 */
Router.getMarkup(style)

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
***Theory***\
A component in Freedactive is a first class function, meaning that functions
are treated like variables or objects.

Component:
- constructor - the function itself creating the component (e.g. function Test())
- private - variables or methods declard with var inside a function (var is function scoped)
- public - variables or methods declared using this inside a function

Prototypical Inheritance:
- inheriting properties - Object.create allows you to inherit from the prototype of another function or object
- overriding properties - modifying the prototype of your component allows you to override properties in your parent function or object

```js
var Test = Test() {
    /* constructor */

    /* properties */
    // public
    this.publicVariable = 6;
    this.publicFunc = function() { }
    // private
    var privateVariable = 7;
    var privateFunc = function() { }

     /* constructor */
}

// inherit properties from Component
Test.prototype = Object.create(Component.prototype);

// override the Component getMarkup property
Test.prototype.getMarkup = function() {
    return 'your markup';
}
```

***Component Properties***\
These properties are populated to your component when you inherit from the Component object

- getMarkup - a string of the components html content
- getStyle - the path to your style sheet for that component
*Note Freedactive also supports inline styles using the 'Style' object*
- getChildren - any components being used in the markup of the component

These properties are getters to help encapsulate your components.
For example, using getters prevents any access modification mistakes
such as overwriting the markup or style of a component.

```js
var App = App() {
}
App.prototype = Object.create(Component.prototype);

App.prototype.getMarkup = function() {
    return ('
        <div>\
            <h1>Welcome to Freedactive!</h1>\
        </div>\
    ');
}
App.prototype.getStyle = function() {
    return './App.css';
}
App.prototype.getChildren = function() {
    return [
        CustomButton,
        CustomView
    ];
}
```

***Using Components in Components***\
Using a component in another component is simple, we can use Freedactives
string 'cash' method to insert a component's markup into another components
markup. First we must invoke our components constructor 'new MyButton()' to obtain
our components public properties, next we call our 'getMarkup' method to
insert our 'MyButton' component's html 'new MyButton().getMarkup()'. 

```js
var MyButton = function MyButton() {
}
MyButton.prototype = Object.create(Component.prototype);

MyButton.prototype.getMarkup = function() {
    return ('
        <div>\
            <button>MyButton</button>\
        </div>\
    ');
}

MyButton.prototype.getStyle = function() {
    return './MyButton.css';
}
```

```js
var App = function App() {
}
App.prototype = Object.create(Component.prototype);

App.prototype.getMarkup = function() {
    return ('
        <div>\
            <h1>Welcome to Freedactive!</h1>\
            ${customButton}\
        </div>\
    ').$({
        customButton: new MyButton().getMarkup()
    });
}

App.prototype.getStyle = function() {
    return './App.css';
}

App.prototype.getChildren = function() {
    return [
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
var App = function App() {
}
App.prototype = Object.create(Component.prototype);

App.prototype.getMarkup = function() {

    var headerStyle = Style({
        color: 'blue'
    });

    return ('
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
You first call 'Router.set' to set the routes and their corresponding component. Then use the 'Router.
routeto' method for the event of your choice to cause that route to be executed.
*Note when using the Router object you do not need to include your routing components in the children array of your component (NavBar)*

```js
var NavBar = function NavBar() { 
    // Sets your routes
    Router.set({
        '/': App,
        '/docs': Docs,
        '/hello': Hello,
        '/hello/world': World
    });
}
NavBar.prototype = Object.create(Component.prototype);

NavBar.prototype.getMarkup = function() {
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
     * Place the router's markup 'Router.getMarkup()' where you
     * want to display your components when 'Router.routeto' is called.
     */
    return ('\
        <div>\
            <ul>\
                ${items}\
            </ul>\
            <span></span>\
        </div>\
        ${Router}\
    ').$({
        items: lis.map(function(li) { return li; }).join(""),
        Router: Router.getMarkup()
    });
}
```

### Events
***Event Handlers***\
Event handlers for components in Freedactive are just component methods.

```js
var HelloWorld = function HelloWorld() {
    /**
    *   public method notify to handle onclick event
    */
    this.notify = function() {
        // any DOM manipulation goes here
        alert('Hello World!');
    }
}
HelloWorld.prototype = Object.create(Component.prototype);

// onclick event to invoke the 'notify' function
HelloWorld.prototype.getMarkup = function() {
    return ('
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
