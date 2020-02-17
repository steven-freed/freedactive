'use strict';

require('./freedactive.js');

test('JSXS', () => {

    global.App = function App() {};
    App.prototype = new Component;
    App.prototype.markup = function() {
        return ('<div id="app"><NavBar />' +
        '<h1 id="phrase">Welcome to Freedactive!</h1>' +
        '<View/></div>');
    }

    global.View = function View() {};
    View.prototype = new Component;
    View.prototype.markup = function() {
        return ('<div><h1>Hey</h1>${}</div>').$({
            innerHTML: this.props['innerHTML'] ? this.props['innerHTML'] : ''
        });
    }

    global.Button = function Button() {};
    Button.prototype = new Component;
    Button.prototype.markup = function() {
        return '<button>Press me</button>';
    }
    
    global.NavBar = function NavBar() {};
    NavBar.prototype = new Component;
    NavBar.prototype.markup = function() {
        return ('<div id="navbar">' +
            '<ul>' +
            '<li>' +
                '<View>' +
                    '<img src="somewhere..." alt="home"></img>' +
                '</View>' +
            '</li>' +
            '<li>' +
                '<View>' +
                    '<Button/>' +
                    '<View>' +
                        '<Button/>' +
                    '</View>' +
                '</View>' +
            '</li>' +
            '</ul>' +
        '</div>');
    }

    const html = '<div id="app"><div id="navbar"><ul><li><div><h1>Hey</h1>' +
                '<img src="somewhere..." alt="home"></img></div></li><li><div>' +
                '<h1>Hey</h1><button>Press me</button><div><h1>Hey</h1>' +
                '<button>Press me</button></div></div></li></ul></div>' +
                '<h1 id="phrase">Welcome to Freedactive!</h1><div><h1>Hey</h1></div></div>';

    expect(new App().__$jsxsifyMarkup()).toBe(html);
});

test('Link', () => {

    global.App = function App() {};
    App.prototype = new Component;
    App.prototype.markup = function() {
        return ('<div id="app"><Link/>' +
        '<h1 id="phrase">Welcome to Freedactive!</h1></div>');
    }

    /**
     * Required attribute test
     */
    expect(() => new App().__$jsxsifyMarkup()).toThrow('Link requires the attribute "path" and the JSXS component Switch to function correctly.');

    App.prototype.markup = function() {
        return ('<div id="app"><Link path="/somewhere" style="color:blue;height:23px;"/>' +
        '<h1 id="phrase">Welcome to Freedactive!</h1></div>');
    }

    var html = ('<div id=\"app\"><a href=\"/somewhere\" style=\"color:blue;height:23px;\" ' + 
                'onclick=\"Freedactive.__$router.__$pushState(event)\">' +
                '</a><h1 id=\"phrase\">Welcome to Freedactive!</h1></div>');
   
    /**
     * Props test
     */
    expect(new App().__$jsxsifyMarkup().replace(/\s/g, '')).toBe(html.replace(/\s/g, ''));

    App.prototype.markup = function() {
        return ('<div id="app"><Link path="/somewhere">Freedactive</Link>' +
        '<h1 id="phrase">Welcome to Freedactive!</h1></div>');
    }

    html = ('<div id=\"app\"><a href=\"/somewhere\" onclick=\"Freedactive.__$router.__$pushState(event)\">' +
    'Freedactive</a><h1 id=\"phrase\">Welcome to Freedactive!</h1></div>');
   
    /**
     * innerHTML prop test
     */
    expect(new App().__$jsxsifyMarkup().replace(/\s/g, '')).toBe(html.replace(/\s/g, ''));
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