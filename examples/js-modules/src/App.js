import NavBar from './components/NavBar/NavBar.js';

export default class App extends Component {

    getMarkup() {
        return (`
            <div>
                ${new NavBar().getMarkup()}
                <h1 id="phrase">Welcome to Freedactive!</h1>
            </div>
        `);
    }

    getStyle() {
        return './src/App.css';
    }
    
    getChildren() {
        return [
            NavBar
        ];
    }
}

Freedactive.init(App);