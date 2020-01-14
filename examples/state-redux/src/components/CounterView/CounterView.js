function CounterView() {

    this.getMarkup = function() {
        return ('\
            <div id="counter-view">\
                <p>Count <span id="value">0</span></p>\
                    <button onclick="increment()">+</button>\
                    <button onclick="decrement()">-</button>\
            </div>\
        ');
    }

    this.getStyle = function() {
        return './src/components/CounterView/CounterView.css';
    }

    /**
     * subscribes store to any dispatched 'counter' action
     */
    store.subscribe(function() {  
        document.getElementById('value').innerHTML = store.getState().toString();
    });

    /**
     * dispatched increment action creator
     */
    this.increment = function() {
        store.dispatch(incrementCounter())
    }

    /**
     * dispatched decrement action creator
     */
    this.decrement = function() {
        store.dispatch(decrementCounter())
    }

};
