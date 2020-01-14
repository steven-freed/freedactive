function App() {

    this.getMarkup = function() {
        return ('\
            <div>\
                ${NavBar}\
                <h1 id="phrase">Welcome to Freedactive!</h1>\
            </div>\
        ').$({
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
