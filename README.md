# ![Alt text](/assets/favicon.png?raw=true) Freedactive
*The Single Page Application Framework for JavaScript developers, not framework developers*

## Purpose?
The motivation of this framework came about after using all these great SPA frameworks such as: 
React, Angular, and Vue. After using them I noticed that I knew alot about these frameworks but
I didn't know alot about JavaScript or traditional web development. This inspired me to
create Freedactive, another old SPA framework you need to keep up with. However this one is
for 'JavaScript' developers, *not* framework developers. Now you can harness the power of an
SPA with simple JavaScript expertise rather than pages of 3rd party documentation.

## API
### Router
1. Router({ path: component }) - returns div container that will handle swapping components based on route accessed.
2. routeto(path) - Event listener that should be registered with elements when using Router.
example:
```js
const markup = "<button onclick=`routeto("${path}")`></button>";
```

### Style
1. Style({ property: "value" }) - returns inline style given an object of camel cased property and dashed string value pairs (very similar to React's inline styles).

## Documentation
### Setup
In your index.html file you must have: 
1. freedactive.min.js file from https://steven-freed.github.io/freedactive/freedactive.min.js
containing the framework
2. your entry component App.js
(with type "module" if using ECMAScript2015+)
3. script tag to initialize the freedactive library with your entry component
(with type "module" if using ECMAScript2015+)
4. div with id "app-container"
```html
<!DOCTYPE html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
        <title>Freedactive</title>

        <!-- 1 -->
        <script src="https://steven-freed.github.io/freedactive/freedactive.min.js"></script>
        <!-- 2 -->
        <script src="/App.js" type="module"></script>
        <!-- 3 -->
        <script type="module">
            import App from './App.js';
            Freedactive.init(App);
        </script>
    </head>
    <body>
        <!-- 4 -->
        <div id="app-container"></div>
    </body>
</html>
```

### Components 
*ECMAScript2015+ syntax version*
#### Theory
A component in Freedactive is a first class function that returns an object literal.
Components are structured in this fashion to allow developers to harness the power
of access modifiers in JavaScript.

1. constructor: the function component itself, in this case everything above
'return' in the App function.
2. private: any variables or methods placed above 'return'
3. public: any variables or methods placed in the returned object literal

example:
```js
function App() {

    // constructor

    let privateVariable = 5;
    let privateMethod = function() {
        // do stuff
    };

    // public variables and methods
    return {
        setPrivateVariable: (x) => privateVariable = x,
        getPrivateVariable: () => privateVariable,
        publicVariable: 6,
        publicMethod: function() {
            // do more stuff
        }
    }
}
```

#### Component Required Properties
Components also require some properties and methods as well as your choice of
adding your own for logic or event handlers.

1. markup: a string of the components html content
2. style: the path to your style sheet for that component
(Note: Freedactive also supports inline styles using the 'Style' object)
3. children: any components being used in the markup of the component

These 3 properties should be private and have getters inside the returned
object literal. This prevents any access modification mistakes such as overwriting
the markup or style sheet src of a component.

example:
```js
function App() {

    const markup = (`
        <div id="App">
            <h1>Welcome to Freedactive!</h1>
        </div>
    `);
    const style = './App.css';
    const children = [
    ];
    return {
        getMarkup: () => markup,
        getStyle: () => style,
        getChildren: () => children,
    }
}

export default App;
```

#### Using Children in a Component
Using a component in another component is simple, we can use JavaScripts
backtick strings to insert a component's markup into another components
markup. First we must invoke our components constructor 'MyButton()' to obtain
our components public properties, next we call our 'getMarkup' method to
insert our 'MyButton' component's html 'MyButton().getMarkup()'. 

example:
```js
function MyButton() {
    const markup = (`
        <div id="MyButton">
            <button>MyButton</button>
        </div>
    `);
    const style = './MyButton.css';
    const children = [
    ];
    return {
        getMarkup: () => markup,
        getStyle: () => style,
        getChildren: () => children
    }
}

export default MyButton;
```

```js
import MyButton from './MyButton.js';

function App() {

    const markup = (`
        <div id="App">
            <h1>Welcome to Freedactive!</h1>
            ${MyButton().getMarkup()}
        </div>
    `);
    const style = './App.css';
    const children = [
        MyButton
    ];
    return {
        getMarkup: () => markup,
        getStyle: () => style,
        getChildren: () => children,
    }
}

export default App;
```

### Styles
#### Inline Styles
Freedactive inline styles are very similar to React's inline styles. You use
camel casing of normal css attributes for keys and normal css values for values.

example:
```js
function App() {

    const headerStyle = Style({
        color: "blue"
    });

    const markup = (`
        <div id="App">
            <h1 style=${headerStyle}>Welcome to Freedactive!</h1>
        </div>
    `);
    const style = '';
    const children = [
    ];
    return {
        getMarkup: () => markup,
        getStyle: () => style,
        getChildren: () => children,
    }
}

export default App;
```

### Routing
#### Router Object
Navigation is a big concern in SPA. With Freedactive you get the framework
with batteries included (a Router). To setup routing create a 'Router' object
and pass it an object literal containing your routes.
(Note: when using the Router object you do not need to include your routing components in the children array of your component (NavBar))

example:
```js
import { Router, } from './freedactive.js';

import App from './App.js';
import About from './About.js';
import Contact from './Contact.js';

function NavBar() { 

    const routes = {
        '/': App,
        '/about': About,
        '/contact': Contact
    };

    // create route list items
    const lis = Object.keys(routes).map((path) => {
        return `<li onclick="routeto('${path}')">${routes[path].name}</li>`
    });

    const markup = (`
        <div id="navbar">
            <ul>
                    ${lis.map((li) => li).join('')}
            </ul>
            ${
                Router(routes)
            }
        </div>
    `);
    const style = './NavBar.css';
    const children = [
    ];
    return {
        getMarkup: () => markup,
        getStyle: () => style,
        getChildren: () => children,
    };

}

export default NavBar;
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
    const markup = (`
        <div id="hello-world">
            <button onclick="notify()">Press Here</button>
        </div>
    `);
    const style = './HelloWorld.css';
    const children = [
    ];
    return {
        getMarkup: () => markup,
        getStyle: () => style,
        getChildren: () => children,
        /**
        *   public method notify to handle onclick event
        */
        notify: function() {
            alert('Hello World!');
        },
    }
};

export default HelloWorld;
```
