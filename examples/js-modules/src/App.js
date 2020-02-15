class App extends Component {

    constructor() {
        super();
        this.markup = (`
            <div id="app">
                <NavBar />
                <h1 id="phrase">Welcome to Freedactive!</h1>
            </div>
        `);
    }
    
}

// initialize with entry component
Freedactive.init(App, {
    /**
     * Paths to all components
     */
    scripts: [
        '/src/components/NavBar/NavBar.js',
        '/src/components/Docs/Docs.js',
        '/src/components/Hello/Hello.js',
        '/src/components/Hello/World/World.js'
    ],
    /**
     * Paths to all styles
     */
    styles: [
        '/src/App.css',
        '/src/components/NavBar/NavBar.css',
        '/src/components/Docs/Docs.css',
        '/src/components/Hello/Hello.css',
        '/src/components/Hello/World/World.css'
    ]
});