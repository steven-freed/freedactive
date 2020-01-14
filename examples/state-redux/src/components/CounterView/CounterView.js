function CounterView() {

    this.getMarkup = function() {
        return ('\
            <div id="counter-view">\
                <p>Clicked: <span id="value">0</span> times\
                    <button id="increment">+</button>\
                    <button id="decrement">-</button>\
                </p>\
            </div>\
        ').$({
            comp: "'/hello/world'"
        });
    }

    this.getStyle = function() {
        return './src/components/CounterView/CounterView.css';
    }
};

var valueEl = document.getElementById('value');

function render() {
    valueEl.innerHTML = store.getState().toString()
}

render();
store.subscribe(render);