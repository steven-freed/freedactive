const fa = require('./freedactive.js');

test('Style', () => {
    expect(fa.Style({
        fontSize: '24px',
        color: 'blue',
        backgroundColor: 'green'
    })).toBe('font-size:24px;color:blue;background-color:green;');
});

test('Cash Function', () => {
    expect('Hi my name is ${name} and my job is ${job}'.$({
        name: 'steve',
        job: (function() { return 'making freedactive'; })()
    })).toBe('Hi my name is steve and my job is making freedactive');
});

test('Router', () => {
    const ROUTER_CONTAINER = 'app-router-container';
    const routerStyle = fa.Style({
        position: 'absolute',
        textAlign: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgb(113, 47, 242)'
    });
    expect(fa.Router.getMarkup()).toBe('<div id="${container}" style="${style}"></div>'.$({
        container: ROUTER_CONTAINER,
        style: routerStyle
    }));
});

test('State', () => {
    const reducer = function (state, action) {
        if (typeof state === 'undefined')
          return 1;
        switch (action.type) {
          case 'INCREMENT':
            return state + 1;
          default:
            return state;
        }
    };
    const state = new fa.State(reducer, 0);
    expect(state.getState()).toBe(0);
    
    var action = { type: 'INCREMENT' };
    expect(state.pub(action)).toBe(action);
    expect(state.getState()).toBe(1);
});
