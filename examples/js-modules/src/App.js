import NavBar from './components/NavBar/NavBar.js';

export default class App extends Component {

    constructor() {
        super();
        this.markup = (`
            <div>
                ${new NavBar().markup}
                <h1 id="phrase">Welcome to Freedactive!</h1>
            </div>
        `);
        this.style = './src/App.css';
        this.children = [
            NavBar
        ];
    }

}

Freedactive.init(App);