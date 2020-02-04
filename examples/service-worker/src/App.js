var App = function App() {
};

App.prototype = Object.create(Component.prototype);

App.prototype.getMarkup = function() {
    return ('\
        <div>\
            ${NavBar}\
            <h1 id="phrase">Welcome to Freedactive!</h1>\
        </div>\
    ').$({
        NavBar: new NavBar().getMarkup()
    });
}

App.prototype.getStyle = function() {
    return './src/App.css';
}

App.prototype.getChildren = function() {
    return [
        NavBar
    ];
}

Freedactive.init(App);