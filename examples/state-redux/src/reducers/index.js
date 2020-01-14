/**
 * reducers
 */
var counter = function(state, action) {
    if (typeof state === 'undefined')
        return 0;
    switch (action.type) {
      case INCREMENT:
        return state + 1;
      case DECREMENT:
        return state - 1;
      default:
        return state;
    }
};

// combines multiple reducers if needed
Redux.combineReducers({
  counter
});

// creates store
var store = Redux.createStore(counter);

// subscribes to store for dispatch logging
store.subscribe(function() {
  console.log(store.getState());
});
