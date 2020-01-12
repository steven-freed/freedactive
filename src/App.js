
function App() {

    this.getMarkup = function() {
        return ('\
            <div id="App">\
                <h1>App</h1>\
                <p>stuff and more stuff...</p>\
                ${NavBar}\
            </div>').$({
                NavBar: new NavBar().getMarkup()
            });
    }
    this.getStyle = function() {
        return './src/App.css';
    }
    this.getChildren = function() {
        return [
            NavBar
        ];
    }
}

Freedactive.init(App);
