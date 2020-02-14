App.prototype = new Component;

function App() {

    this.markup = ('\
        <div>\
            <NavBar />\
            <h1 id="phrase">Welcome to Freedactive!</h1>\
        </div>\
    ');
}

// initialize with entry component
Freedactive.init(App, {
    scripts: [
        /**
         * Paths to all components
         */
        '/src/components/NavBar/NavBar.js',
        '/src/components/CounterView/CounterView.js',
        /**
         * Paths to all Actions and Reducers
         */
        '/src/actions/index.js',
        '/src/reducers/index.js'
    ],
    /**
     * Paths to all styles
     */
    styles: [
        '/src/App.css',
        '/src/components/NavBar/NavBar.css',
        '/src/components/CounterView/CounterView.css',
    ]
});