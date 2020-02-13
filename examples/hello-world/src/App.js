App.prototype = new Component;

function App() {

    this.markup = ('\
        <div id="app">\
            <Link to="/hello" name="Hello"/>\
            <Switch routes="{ \"/hello\": \"Hello\" }" />\
            <h1 id="phrase">Welcome to Freedactive!</h1>\
        </div>\
    ');
}

Freedactive.init(App, {
    scripts: [
        '/src/components/NavBar/NavBar.js',
        '/src/components/Docs/Docs.js',
        '/src/components/Hello/Hello.js',
        '/src/components/Hello/World/World.js'
    ],
    styles: [
        '/src/App.css',
        '/src/components/NavBar/NavBar.css',
        '/src/components/Docs/Docs.css',
        '/src/components/Hello/Hello.css',
        '/src/components/Hello/World/World.css'
    ]
});