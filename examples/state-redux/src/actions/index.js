/**
 * action types
 */
var INCREMENT = 'INCREMENT';
var DECREMENT = 'DECREMENT';

/**
 * action creators
 */
var incrementCounter = function() {
    return { type: INCREMENT };
};

var decrementCounter = function() {
    return { type: DECREMENT };
};

document.getElementById('increment')
.addEventListener('click', function () {
    store.dispatch(incrementCounter);
});

document.getElementById('decrement')
.addEventListener('click', function () {
    store.dispatch(decrementCounter);
});

/**
 * asyc example
 * 
document.getElementById('incrementAsync')
.addEventListener('click', function () {
    setTimeout(function () {
        store.dispatch(INCREMENT);
    }, 1000);
});
*/
