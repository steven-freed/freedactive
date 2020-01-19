/**
 * Action Types
 */
var Type = {
    INCREMENT: 'INCREMENT',
    DECREMENT: 'DECREMENT'
};

/**
 * Action Creators
 */
var Creator = (function() {
    function incrementCounter() {
        return { type: Type.INCREMENT };
    };

    function decrementCounter() {
        return { type: Type.DECREMENT };
    };

    return {
        incrementCounter,
        decrementCounter
    };
})();