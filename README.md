# ![Alt text](/examples/hello-world/assets/favicon.png?raw=true) Freedactive
*The Single Page Application Framework for JavaScript developers, not framework developers*

## Purpose?
There are many great SPA frameworks such as React and Angular. Almost all of them involve
downloading many external libraries and use ES6 syntax with transpilers. ES5 has many faults
and foreign programming concepts to many traditional programmers such as; functional programming
and prototypical inheritance. The goal of Freedactive is to give developers an easy way to
say goodbye to transpilers and frameworks that require other packages as add ons for vital
functionality. Freedactive achieves this goal by providing developers an intuitive way to write 
modular ES5 syntax and help build developers JavaScript skills rather than give them a great
new syntax (ES6) that requires several libraries to function.\
Freedactive is very easy to get started with and requires zero installations.\
Get started now below, happy coding!

## Quick Start
### Setup
In your index.html file you must have: 
1. freedactive.min.js file from https://steven-freed.github.io/freedactive/freedactive.min.js
containing the framework
2. your entry component (for example App.js) and all other components you've created
3. div with id "app-container"
4. initialize Freedactive in your entry component
5. Optional Step: register service worker to cache content for offline use
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
function App() {

    this.getMarkup = function() {
        return ('\
            <div>\
                <h1>Welcome to Freedactive!</h1>\
            </div>\
        ');
    }

    this.getStyle = function() {
        return './src/App.css';
    }
}

/**    4    **/
Freedactive.init(App);
/**    5    **/
// register();
```

## API

### Strings
Strings in Freedactive are like normal ES5 js strings (single and double quotes).
To overcome the messy string interpolation of ES5, Freedactive extends the String
prototype by adding the 'cash' method to allow for ES6 backtick *like* string
interpolation. The cash function also relieves you from needing to escape quotes
if using them in variables.\
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

### Router
Router is a singleton that provides SPA routing to your application.\
```js
/**
* Initializes the component Router.
* 
* @param {Object} comps path, component pairs to initialize router
*/
set(comps)

/**
 * Inserts router container to swap out router components
 * for Events invoking 'routeto'.
 * 
 * @param {Object} style prop value pairs of camel cased, dashed css 
 * @returns {String} router container to swap out router components
 */
getMarkup(style)

/**
 * Event listener for route changes. Should be registered with
 * html element such as a button, li, etc.
 * 
 * @param {string} link the specified route to listen for 
 */
routeto(link)

// example
example:
var markup = ('<button onclick="routeto(${path})"></button>').$({ path: '/my-path' });
```

### Style
Style provides a translation from a js object literal prop, value pairs where
prop is a camel cased css property and value is a normal css value as a string.\
```js
/**
 * Inline Style creator, uses camel casing object literals
 * and converts them to standard css dashed conventions.
 *
 * @param {object} style property, value object literal using camel casing 
 * @returns {String} inline css style string
 */
Style(style)
```

## Documentation
### Components
#### Theory
A component in Freedactive is a first class function that returns an object literal.
Components are structured in this fashion to allow developers to harness the power
of access modifiers in JavaScript.

1. constructor: the function component itself, everything in the Test function
2. private: any variables or methods declard with var (var is function scoped)
3. public: any variables or methods declared using this

example:
```js
function Test() {

    // constructor

    // private
    var privateVariable = 5;
    var privateMethod = function() {
        // do stuff
    }

    // public
    this.publicVariable = 6;
    this.publicMethod = function() {
        // do stuff
    }

    // getters and setters
    this.setPrivateVariable = function(x) {
        privateVariable = x;
    }
    this.getPrivateVariable = function() {
        return privateVariable;
    }

    // constructor
}
```

#### Component Required Properties
Components also require some properties and methods as well as your choice of
adding your own for logic or event handlers.

1. getMarkup: a string of the components html content
2. getStyle: the path to your style sheet for that component
(Note: Freedactive also supports inline styles using the 'Style' object)
3. getChildren: any components being used in the markup of the component

These 3 properties should be private and have getters. This prevents any
access modification mistakes such as overwriting the markup or style
sheet src of a component.

example:
```js
function App() {

    this.getMarkup = function() {
        return ('
            <div>\
                <h1>Welcome to Freedactive!</h1>\
            </div>\
        ');
    }
    this.getStyle = function() {
        return './App.css';
    }
    this.getChildren = function() {
        return [
            CustomButton,
            CustomView
        ];
    }
}
```

#### Using Children in a Component
Using a component in another component is simple, we can use Freedactives
'cash' function to insert a component's markup into another components
markup. First we must invoke our components constructor 'new MyButton()' to obtain
our components public properties, next we call our 'getMarkup' method to
insert our 'MyButton' component's html 'new MyButton().getMarkup()'. 

example:
```js
function MyButton() {
    this.getMarkup = function() {
        return ('
            <div>\
                <button>MyButton</button>\
            </div>\
        ');
    this.getStyle = function() {
        return './MyButton.css';
    }
    this.getChildren = function() {
    }
}
```

```js
function App() {

    this.getMarkup = function() {
        return ('
            <div>\
                <h1>Welcome to Freedactive!</h1>\
                ${customButton}\
            </div>\
            ').$({
            customButton: new MyButton().getMarkup()
        });
    }
    this.getStyle = function() {
        return './App.css';
    }
    this.getChildren = function() {
        return [
            MyButton
        ];
    }
}
```

### Styles
#### Inline Styles
Freedactive inline styles are very similar to React's inline styles. You use
camel casing of normal css attributes for keys and normal css values for values.

example:
```js
function App() {

    var headerStyle = Style({
        color: 'blue'
    });

    this.getMarkup = function() {
        return ('
            <div>\
                <h1 style=${style}>Welcome to Freedactive!</h1>\
            </div>\
            ').$({
            style: headerStyle
        });
    }

    this.getStyle = function() {
    }
    this.getChildren = function() {
    }
}
```

### Routing
#### Router Object
Navigation is a big concern in SPA. With Freedactive you get the framework
with batteries included (a Router). To setup routing create a 'Router' object
and pass it an object literal containing your routes.
(Note: when using the Router object you do not need to include your routing components in the children array of your component (NavBar))

example:
```js
function NavBar() { 

    // Sets your routes
    Router.set({
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

    // create route list items
    var lis = Object.keys(navbarRoutes).map(function(k) {
        return ('<li onclick="routeto(${key})">${route}</li>').$({
            key: "'${key}'".$({ k }),
            route: routes[k].name
        });
    });

    this.getMarkup = function() {
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
    this.getStyle = function() {
    }
    this.getChildren = function() {
    }
}
```

### Events
#### Event Handlers
Event handlers for components in Freedactive can be asynchronous, arrow,
anonymous, or named functions. No need to worry about Babel and polyfills.
Your handlers will be converted to named functions and rendered to the DOM
as a script element.

example:
```js
function HelloWorld() {

    // onclick event to invoke the 'notify' function
    this.getMarkup = function() {
        return ('
            <div>\
                <button onclick="notify()">Press Here</button>\
            </div>\
        ');
    }

    /**
    *   public method notify to handle onclick event
    */
    this.notify = function() {
        // any DOM manipulation goes here
        alert('Hello World!');
    }
}
```
