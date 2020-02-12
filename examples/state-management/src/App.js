App.prototype = new Component;

function App() {

    this.markup = ('\
        <div>\
            <NavBar />\
            <h1 id="phrase">Welcome to Freedactive!</h1>\
        </div>\
    ');

    this.style = './src/App.css';
    this.router = NavBar;
}

Freedactive.init(App, [
    /**
     * Components
     */
    '/src/components/NavBar/NavBar.js',
    '/src/components/CounterView/CounterView.js',
    /**
     * Actions and Reducers
     */
    '/src/actions/index.js',
    '/src/reducers/index.js'
]);