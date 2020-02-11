App.prototype = new Component;

function App() {

    this.markup = ('\
        <div>\
            <div></div>\
            <NavBar prop1="sup" prop2="you" />\
            <h1 id="phrase">Welcome to Freedactive!</h1>\
        </div>\
    ');

    this.style = './src/App.css';
    this.router = NavBar;
}

Freedactive.init(App, [
    '/src/components/NavBar/NavBar.js',
    '/src/components/Docs/Docs.js',
    '/src/components/Hello/Hello.js',
    '/src/components/Hello/World/World.js'
]);