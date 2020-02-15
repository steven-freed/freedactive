'use strict';

require('./freedactive.js');
test('JSXS', () => {

    global.App = function App() {
        this.markup = ('<div id="app"><NavBar /><h1 id="phrase">Welcome to Freedactive!</h1></div>');
    }
    App.prototype = new Component;

    global.View = function View() {
        this.markup = ('<div><h1>Hey</h1>${}</div>').$({
            innerHTML: this.props['innerHTML'] ? this.props['innerHTML'] : ''
        });
    }
    View.prototype = new Component;
    
    global.NavBar = function NavBar() {
    
        this.markup = ('<div id="navbar">' +
                '<ul>' +
                '<li>' +
                    '<View>' +
                        '<img src="somewhere..." alt="home"></img>' +
                    '</View>' +
                '</li>' +
                '<li>' +
                    '<button>Still Testing</button>' +
                '</li>' +
                '</ul>' +
            '</div>');
    }
    NavBar.prototype = new Component;

    const html = '<div id="app">' + 
        '<div id="navbar"><ul><li>' + 
        '<div><h1>Hey</h1><img src="somewhere..." alt="home"></img></div>' +
        '</li><li>' + 
        '<button>Still Testing</button>' +
        '</li></ul></div><h1 id="phrase">Welcome to Freedactive!</h1></div>';

    expect(new App().markup._jsx$()).toBe(html);
});

test('Style', () => {
    
    const testStyle = Style({
        fontSize: '24px',
        color: 'blue',
        backgroundColor: 'green'
    });
    const style = 'font-size:24px;color:blue;background-color:green;';
    expect(testStyle).toBe(style);
});

test('Route', () => {
    function App() {}
    App.prototype = new Component;
    function Hello() {}
    Hello.prototype = new Component;
    function World() {}
    World.prototype = new Component;
    const testRoutes = Route({
        '/': App,
        '/hello': Hello,
        '/hello/world': World
    });
    const routes = '/:App;/hello:Hello;/hello/world:World;';
    expect(testRoutes).toBe(routes);
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