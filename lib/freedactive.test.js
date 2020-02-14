'use strict';

require('./freedactive.js');
/*
test('JSXS', () => {
    
    Switch.prototype = new Component;
    Link.prototype = new Component;
    View.prototype = new Component;
    function Switch() {
        this.markup = '<div id="container"></div>';
    }
    function Link() {
        this.markup = '<a href="stuff">${}</a>'.$({
            innerHTML: this.props['innerHTML'] ? this.props['innerHTML'] : ''
        });
    }
    function View() {
        this.markup = ('<div>\
            <h1>Hey</h1>\
            ${}\
        </div>').$({
            innerHTML: this.props['innerHTML'] ? this.props['innerHTML'] : ''
        });
    }
    
    function NavBar() {
    
        this.markup = ('<div id="navbar">\
        <ul>\
            <li>\
                <Link path="/">\
                    <img src="somewhere..." alt="home"></img>\
                </Link>\
            </li>\
            <li>\
                <Link path="/hello" name="Hello" />\
            </li>\
        </ul>\
        <span></span>\
        <Switch routes="{ \'/hello\': \'Hello\' }" />\
    </div>');
    
    }
    
    function App() {
        this.markup = ('\
        <div id="app">\
            <NavBar />\
            <h1 id="phrase">Welcome to Freedactive!</h1>\
        </div>');
    }
});
*/

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
    
    const action = { type: 'INCREMENT' };
    expect(state.pub(action)).toBe(action);
    expect(state.getState()).toBe(1);
});