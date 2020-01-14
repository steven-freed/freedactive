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
