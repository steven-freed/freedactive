# ![Alt text](/examples/hello-world/assets/favicon.png?raw=true) Freedactive
*The Single Page Application Framework for JavaScript developers, not framework developers*

## Purpose?
There are many great SPA frameworks such as React and Angular. Almost all of them involve
downloading many external libraries and use ES6 syntax with transpilers. ES5 has its faults
and foreign programming concepts to many traditional programmers such as; functional programming
and prototypical inheritance. The goal of Freedactive is to give developers an easy way to
say goodbye to transpilers and frameworks that require npm and many other packages for vital
functionality. Freedactive provides developers with an intuitive way to write modular ES5 syntax
and get a web application up in minutes. Freedactive is very easy to get started with and
requires zero installations.\
Get started now below, happy coding!

## Quick Start
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

### Router
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
 * for Events invoking 'routeto'.
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
routeto(link)

// example
var markup = ('<button onclick="routeto(${path})"></button>').$({ path: '/my-path' });
```

### Style
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

## Documentation
### Components
***Theory***
A component in Freedactive is a first class function, meaning that functions
are treated like variables or objects. Since *almost* everything in JavaScript is
an object we can treat functions like objects as well. Functional components unlock
the power of access modifiers in JavaScript.\

A functional component may contain the following...
- constructor - the function itself creating the component (e.g. function Test())
- private - any variables or methods declard with var (var is function scoped)
- public - any variables or methods declared using this

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

***Recommended Properties***
These properties are recommended, meaning that if you do not provide a
'getStyle' property you will not obtain the style for that component.
However you may not need any style for that component and that is fine.

- getMarkup - a string of the components html content
- getStyle - the path to your style sheet for that component
*Note Freedactive also supports inline styles using the 'Style' object*
- getChildren - any components being used in the markup of the component

These properties are getters to help encapsulate your components.
For example, using getters prevents any access modification mistakes
such as overwriting the markup or style of a component.

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

***Using Components in Components***
Using a component in another component is simple, we can use Freedactives
string 'cash' method to insert a component's markup into another components
markup. First we must invoke our components constructor 'new MyButton()' to obtain
our components public properties, next we call our 'getMarkup' method to
insert our 'MyButton' component's html 'new MyButton().getMarkup()'. 

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
***Inline Styles***
Freedactive inline styles are very similar to React's inline styles. You use
camel casing of normal css attributes for keys and normal css values for values.
*Note that Styles is a function rather than an object so we do not want to use new when creating an inline style*

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
***Router Object***
Navigation is a big concern in SPAs. With Freedactive you get the framework, batteries included.
You first call 'set' to set the routes and their corresponding component. Then use the 'routeto'
method for the event of your choice to cause that route to be executed.
*Note when using the Router object you do not need to include your routing components in the children array of your component (NavBar)*

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

    /**
     * Create the navbar list items.
     * Have the onclick event call routeto('/yourPath')
     * to display the corresponding component.
     * 
     * @note the 'cash' method being used so you
     * don't have to escape single or double quotes 
     * for 'key', the parameter of 'routeto'.
     */
    var lis = Object.keys(navbarRoutes).map(function(k) {
        return ('<li onclick="routeto(${key})">${route}</li>').$({
            key: "'${yourPath}'".$({ yourPath: k }),
            route: routes[k].name
        });
    });

    /**
     * Place the router's markup 'Router.getMarkup()' where you
     * want to display your components when 'routeto' is called.
     */
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

}
```

### Events
***Event Handlers***
Event handlers for components in Freedactive are just component methods.

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

### State
***Coming Soon...***
