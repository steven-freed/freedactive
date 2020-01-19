function CounterView() {

    this.getMarkup = function() {
        return ('\
            <div id="counter-view">\
                <p>Count <span id="value">${count}</span></p>\
                    <button onclick="increment()">+</button>\
                    <button onclick="decrement()">-</button>\
            </div>\
        ').$({
            count: String(state.getState())
        });
    }

    this.getStyle = function() {
        return './src/components/CounterView/CounterView.css';
    }

    /**
     * subscribes your state instance to any actions published to
     * your state instance
     */
    state.sub(function() {
        document.getElementById('value').innerHTML = state.getState().toString();
    });

    /**
     * publishes the increment action to your state instance
     */
    this.increment = function() {
        state.pub(Creator.incrementCounter())
    }

    /**
     * publishes the decrement action to your state instance
     */
    this.decrement = function() {
        state.pub(Creator.decrementCounter())
    }

};
