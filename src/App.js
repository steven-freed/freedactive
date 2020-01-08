import NavBar from './components/NavBar/NavBar.js';
import MyButton from './components/MyButton/MyButton.js';

function App() {

    const markup = (`
        <div id="App">
            <h1>App</h1>
            <p>stuff and more stuff...</p>
            ${MyButton().getMarkup()}
            ${NavBar().getMarkup()}
        </div>
    `);
    const style = './src/App.css';
    const children = [
        NavBar,
        MyButton
    ];
    return {
        getMarkup: () => markup,
        getStyle: () => style,
        getChildren: () => children,
    }
}

export default App;
