import NavBar from './components/NavBar/NavBar.js';

export default class App extends Component {

    constructor() {
        super();
        this.markup = (`
            <div>
                <NavBar />
                <h1 id="phrase">Welcome to Freedactive!</h1>
            </div>
        `);
        this.style = './src/App.css';
        this.router = NavBar;
    }
}

Freedactive.init(
    App, [
        '/src/components/NavBar/NavBar.js',
        '/src/components/Docs/Docs.js',
        '/src/components/Hello/Hello.js',
        '/src/components/Hello/World/World.js'
    ], {
        modules: true
    }
);