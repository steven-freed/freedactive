'use strict';

require('./freedactive.js');

test('Style', () => {
    
    const testStyle = Style({
        fontSize: '24px',
        color: 'blue',
        backgroundColor: 'green'
    });
    const style = 'font-size:24px;color:blue;background-color:green;';
    expect(testStyle).toBe(style);
});

test('Cash Function', () => {
    const testStrTemps = 'Hi my name is ${name} and my job is ${job}'.$({
        name: 'steve',
        job: (function() { return 'making freedactive'; })()
    });
    const testStrNoTemps = 'Hi my name is ${} and my job is ${}'.$({
        0: 'steve',
        1: (function() { return 'making freedactive'; })()
    });
    const str = 'Hi my name is steve and my job is making freedactive';
    expect(testStrTemps).toBe(str);
    expect(testStrNoTemps).toBe(str);
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
    const state = new State(reducer, 0);
    expect(state.getState()).toBe(0);
    
    var action = { type: 'INCREMENT' };
    expect(state.pub(action)).toBe(action);
    expect(state.getState()).toBe(1);
});