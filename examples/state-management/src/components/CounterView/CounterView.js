CounterView.prototype = new Component;

function CounterView() {

    this.markup = ('\
        <div id="counter-view">\
            <p>Count <span id="value">${}</span></p>\
            <button onclick="increment()">+</button>\
            <button onclick="decrement()">-</button>\
        </div>\
    ').$({
        0: String(state.getState())
    });

     /**
     * subscribes your state instance to any actions published to
     * your state instance
     */
    state.sub(function() {
        document.getElementById('value').innerHTML = state.getState().toString();
    });
    
}

/**
 * publishes the increment action to your state instance
 */
CounterView.prototype.increment = function() {
    state.pub(Creator.incrementCounter())
}

 /**
 * publishes the decrement action to your state instance
 */
CounterView.prototype.decrement = function() {
    state.pub(Creator.decrementCounter())
}