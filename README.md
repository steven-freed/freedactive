# ![Alt text](/examples/hello-world/assets/favicon.png?raw=true) Freedactive &middot; [![Build Status](https://travis-ci.com/steven-freed/freedactive.svg?branch=master)](https://travis-ci.com/steven-freed/freedactive) [![npm version](https://img.shields.io/npm/v/freedactive.svg?style=flat-square)](https://www.npmjs.com/package/freedactive) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/steven-freed/freedactive#contributions)
*The Single Page Application Framework for Frontend JavaScript Developers, Batteries Included*

## Purpose?
Freedactive is a light weight all in one (batteries included) framework with no package manager requirements to allow for a quick easy set up to create great Single Page Web Applications. Freedactive supports ES5 as well as ES6 syntax, the choice is yours!
Get started now below, happy coding!

*Tired of coding out components and other files?*\
Try downloading the freedactive cli to; quickly serve web apps, auto create projects, auto create components, and more.\
https://www.npmjs.com/package/freedactive
```
$ npm -g install freedactive
```

## Quick Start
### ES6

1. import the Freedactive framework
2. import your entry component (e.g. App.js) and global styles
3. create div with id "app-container"
4. initialize Freedactive with your entry component and paths to all other js scripts and css styles
5. run server; copy our 'dev-server.js' node server code or use freedactive-cli to serve your web app

index.html
```html
<!DOCTYPE html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
        <title>My App</title>
        
        <!-- 1 -->
        <script src="https://unpkg.com/freedactive@latest/dist/freedactive.min.js"></script>
        
        <!-- 2 -->
        <script src="/src/App.js"></script>
        <link rel="stylesheet" href="/index.css" />

    </head>
    <body>
        <!-- 3 -->
        <div id="app-container"></div>
    </body>
</html>
```

App.js
```js
class App extends Component {
    constructor() {
        super();
    }

    markup() {
        return (`
            <div>
                <h1>Welcome to Freedactive!</h1>
            </div>
        `);
    }
}

/**    4    **/
Freedactive.init(App, {
    scripts: [],
    styles: [
        '/index.css'
    ]
});
```

Terminal
```
/**    5    **/
$ node dev-server.js
OR
$ freedactive serve
```

### ES5

1. import the Freedactive framework
2. import your entry component (e.g. App.js) and global styles
3. create div with id "app-container"
4. initialize Freedactive in your entry component and paths to all other js scripts and css styles
5. run server; copy our 'dev-server.js' node server code or use freedactive-cli to serve your web app
 
index.html
```html
<!DOCTYPE html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
        <title>My App</title>
        
        <!-- 1 -->
        <script src="https://unpkg.com/freedactive@latest/dist/freedactive.min.js"></script>
        
        <!-- 2 -->
        <script src="/src/App.js"></script>
        <link rel="stylesheet" href="/index.css" />

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
    // constructor
}

App.prototype.markup = function() {
    return ('\
        <div>\
            <h1>Welcome to Freedactive!</h1>\
        </div>\
    ');
}

/**    4    **/
Freedactive.init(App, {
    scripts: [],
    styles: [
        '/index.css'
    ]
});
```

Terminal
```
/**    5    **/
$ node dev-server.js
OR
$ freedactive serve
```

**Note: If using your own server, Freedactive requires that your server must always serve the index.html file**

## Documentation

### Initializing Freedactive
Freedactive is initialized by calling the 'init' method in the same file as 
your entry component. The first argument of init is your entry component, the
second is an object containing all other component script paths and css style
paths. If you have no imports simply pass an empty object literal as the
second argument.

```js
class App extends Component {
    constructor() {
        super();
    }

    markup() {
        return (`
            <div>Welcome to Freedactive</div>
        `);
    }
}

Freedactive.init(App, {
    scripts: [
        '/src/components/Button.js',
        '/src/components/View.js'
    ],
    styles: [
        '/src/App.css',
        '/src/components/Button.css',
        '/src/components/View.css'
    ]
})
```

### Components
Components can be JavaScript functions or classes. Components provide a mechanism for
allowing html and JavaScript code reuse.

***Inheritance***\
All components inherit from the Freedactive Component prototype. JavaScript uses
the prototypical inheritance model.

***Component Life Cycle Methods***
* constructor - called when an instance of the component has been created
* markup - called when rendering an instance of the component to the DOM
* componentMounted - called when the component has been successfully rendered to the DOM
* componentUnmounted - called right before the component is removed from the DOM 

Example:
```js
/**
 *  ES6
 */
class Test extends Component {

    constructor() {
        super();
    }

    markup() {
        return (`
            <div>Freedactive</div>
        `);
    }

    componentMounted() {
    }

    componentUnmounted() {
    }
}

/**
 *  ES5
 */
Test.prototype = new Component;
function Test() {
    // constructor
}

Test.prototype.markup = function() {
    return ('\
        <div>Freedactive</div>\
    ');
}

Test.prototype.componentMounted = function() {
}
Test.prototype.componentUnmounted = function() {
}
```

### JSX Strings (JSXS)
Similar to React you can use a JSX *like* syntax called JSXS, JSX Strings
that work just like JSX. JSXS components are **always** capitalized and
may contain a set of required properties and optional properties. JSXS works
with both ES5 and ES6 syntax.

Example:
```js
class Button extends Component {
    constructor() {
        super();
    }

    markup() {
        return (`
            <button>Big Red Button</button>
        `);
    }
}

class App extends Component {
    constructor() {
        super();
    }

    markup() {
        return (`
            <div id="app">
                <h1>Welcome to Freedactive</h1>
                <Button />
            </div>
        `);
    }
}
```


***You Can Even Pass Your Own Properties!***\
Properties are a set of **read only** attributes of components. Any property
can be passed to a JSXS component and retrieved via the 'props' property.

Example:
```js
class App extends Component {
    constructor() {
        super();
    }

    markup() {
        // using the inline Style function
        const style = Style({
            backgroundColor: 'red'
        });

        return (`
            <div id="app">
                <h1>Welcome to Freedactive</h1>
                <Button style=${style} />
            </div>
        `);
    }
}

class Button extends Component {
    constructor() {
        super();
    }

    markup() {
        return (`
            <button style=${this.props.style}>Big Red Button</button>
        `);
    }
}
```

***We've Looked at Self Closing JSXS Tags, Now Lets See Opening and Closing Tag Components***\
Opening and closing tag components use the 'innerHTML' prop (similar to React's children prop) to
nest any other HTML tags, JSXS component tags, or just text in the component.

Example:
```js
class App extends Component {
    constructor() {
        super();
    }

    markup() {
        // using the inline Style function
        const style = Style({
            backgroundColor: 'red'
        });

        return (`
            <div id="app">
                <h1>Welcome to Freedactive</h1>
                <ImageLink>
                    <img src="image.png"></img>
                </ImageLink>
            </div>
        `);
    }
}

class ImageLink extends Component {
    constructor() {
        super();
    }

    markup() {
        return (`
            <a href="#">${this.props.innerHTML}</a>
        `);
    }
}
```

### Styles
***Inline Styles***\
Freedactive inline styles are very similar to React's inline styles. You use
camel casing of normal css attributes for keys and normal css values for values.\
*Note that Styles is a function rather than an object so we do not want to use new when creating an inline style*

```js
class App extends Component {
    constructor() {
        super();
    }

    markup() {
        const headerStyle = Style({
            color: 'blue'
        });

        return (`
            <div>
                <h1 style=${style}>Welcome to Freedactive!</h1>
            </div>
        `);
    }
}
```

### Routing
Switch and Link provide the solution to routing a single page application.

***Switch***\
(Self-Closing Tag)\
Requires a property called 'routes' which must be formatted using the 'Route' function,
this allows Switch to understand your routing mapping.

***Link***\
(Open-Close or Self-Closing Tag)\
Requires a Switch JSXS tag set with the 'routes' property and has a required property
called 'path' with the path you want the Link to route to. Link has a class property called
'fa-link' that may be used to style your Links.

```js
class Navigator extends Component {
        
    constructor() {
        super();

        this.routes = Route({
            '/hello': Hello,
            '/docs': Docs,
            '/hello/world': World
        });

        this.listItems = Object.keys(this.routes).map(function(path) {
            return (`
                <li>
                    <Link path="${path}">${this.routes[path].name}</Link>
                </li>
            `);
        });
    }

    markup() {
        return (`
            <div id="navigator">
                <div>
                    <ul>
                        ${
                            this.listItems.map((li) => li).join('')
                        }
                    </ul>
                </div>
                <Switch routes="${this.routes}" />
            </div>
        `);
    }

}
```

### Events
***Event Handlers***\
Event handlers for components in Freedactive are component methods.
Event handler functions are currently not able to bind to another context.
This means that variables outside of your event handler function will be
undefined.

```js
class HelloWorld extends Component {
    constructor() {
        super();
    }

    markup() {
        return (`
            <div>
                <button onclick="notify(event)">Press Here</button>
            </div>
        `);
    }

    notify(e) {
        alert('Hello World');
    }
}
```

### State
Freedactive offers a simple interface to state management.

***Actions***
* Action Types - different types of actions
```js
const Type = {
    INCREMENT: 'INCREMENT',
    DECREMENT: 'DECREMENT'
};
```

* Action Creators - helper functions to create new actions if those actions take parameters
```js
const Creator = (function() {
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

***Reducers***
* Reducers - changes the state of your instance given the current state and an action
```js
const Reducer = (function() {

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

Action Types, Action Creators, and Reducers are **strongly recommended** to be kept in a self invoking function to reduce clutter in the global namespace. They should be accessed like so...
```js
Reducer.counter;
Type.INCREMENT;
Creator.incrementCounter;
```

***Methods***
* sub - subscribes an event handler function to execute when a state change for your instance occurs\
* pub - publishes an action to change the state of your state instance and invoke your subscribers\
* getState - retrieves the current state of your state instance

Please see https://github.com/steven-freed/freedactive/tree/master/examples/state-management for a full example.

### PWA/HTML Apps
***Service Workers***\
Please see https://github.com/steven-freed/freedactive/tree/master/examples/service-worker for an example
using service workers.

### API
***Component***\
Life Cycle Methods
```js
/**
 * Called when component is created
 */
constructor
/**
 * Renders components markup
 */
markup
/**
 * Component has rendered to DOM
 */
componentMounted
/**
 * Component is about to be removed from DOM
 */
componentUnmounted
```

***ES5 String Templating***\
Strings in Freedactive are like normal ES5 strings (single and double quotes).
To overcome the messy string interpolation of ES5, Freedactive extends the String
prototype by adding the 'cash' method to allow for ES6 backtick *like* string
templating.

```js
// example - properties
var freedactive = "Freedactive";
var html = ('<div>Welcome to ${name}!</div>').$({
    name: freedactive
});

// example - functions
var html = ('<button onclick="${handler}"></button>').$({
    handler: function() {
        alert('Freedactive is great!');
    }
});

// example - no temp vars, ${} uses ordering given, must have unique keys
var html = ('<button onclick="${}">${}</button>').$({
    0: function() {
        alert('Freedactive is great!');
    },
    1: 'Press'
});
```

unfortunately we do still need to use backslashes for multi-line strings for
our components returned markup.

***Style***\
Style provides a translation from an object literal containing { prop: value } pairs where
prop is a camel cased css property and value is a normal css value as a string.

```js
/**
 * Inline Style creator, uses camel casing object literals
 * and converts them to standard css dashed conventions.
 *
 * @param {object} style property, value object literal using camel casing 
 * @returns {string} inline css style string
 */
Style(style)
```

***Route***\
Allows the JSXS Switch component to understand your routes.

```js
/**
* Stringifys routes object so that Switch can interpret it correctly.
* 
* @param {object} routes { path: component } pairs of paths and their associated component
* @returns {string} string representation that Switch understands
*/
Route({
    '/': App,
    '/hello': Hello,
    '/world': World,
    '/hello/world': HelloWorld
});
```

***Switch***\
Holds all routes that Links route to and displays the corresponding component
for that route.

```js
/**
 * @prop {required} routes your formatted routes returned by the 'Route' function
 */ 
<Switch routes />
```

***Link***\
Routes web app to a route given to Switch

```js
/**
 * @prop {required} path the path in Switch to route to
 */ 
<Link path />
<Link path></Link>
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

## Contributions
If you are interested in contributing to Freedactive please submit a pull request indicating your reason for contribution as well as tests for your contribution.

# ![Alt text](/examples/hello-world/assets/favicon.png?raw=true) Freedactive cli
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
**flags**\
-es: es version, defaults to es5
```
$ freedactive component CustomButton
$ freedactive component CustomButton -es 6
```

- **serve**: serves your web app from your working directory (should be ran where your index.html file is located)\
**flags**\
-p: port number, defaults to port 8080
```
MyApp$ freedactive serve
MyApp$ freedactive serve -p 3000
```