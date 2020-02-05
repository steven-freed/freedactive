App.prototype = new Component;

function App() {

    this.markup = ('\
        <div>\
            ${NavBar}\
            <h1 id="phrase">Welcome to Freedactive!</h1>\
        </div>\
    ').$({
        NavBar: new NavBar().markup
    });

    this.style = './src/App.css';
    this.children = [
        NavBar
    ];
}

Freedactive.init(App);