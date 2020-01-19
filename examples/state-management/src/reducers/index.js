/**
 * Reducers
 */
var Reducer = (function() {

  function counter(state, action) {
      if (typeof state === 'undefined')
        return 1;
      switch (action.type) {
        case Type.INCREMENT:
          return state + 1;
        case Type.DECREMENT:
          return state - 1;
        default:
          return state;
      }
  };

  return {
    counter
  };
})();

// creates new state container with initial state of 0
var state = new State(Reducer.counter, 0);

// subscribes to counter state for logging
state.sub(function() {
  console.log(state.getState());
});
