import NavBar from './components/NavBar/NavBar.js';

function App() {

    const markup = (`
        <div id="App">
            <h1>App</h1>
            <p>stuff and more stuff...</p>
            ${NavBar().getMarkup()}
        </div>
    `);
    const style = './src/App.css';
    const children = [
        NavBar
    ];
    return {
        getMarkup: () => markup,
        getStyle: () => style,
        getChildren: () => children,
    }
}

export default App;

// initializes the entry component for Freedactive
Freedactive.init(App);
// registers service worker
register();
