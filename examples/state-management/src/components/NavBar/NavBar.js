NavBar.prototype = new Component;

function NavBar() {

    // Sets your routes
    Router.init({
        '/': App,
        '/counter-view': CounterView
    });
    
    // navbar navigation
    var routes = {
        '/': App,
        '/counter-view': CounterView
    };

    // li elements for routes
    var lis = Object.keys(routes).map(function(k) {
        if (k === '/') {
            return ('\
                <li onclick="Router.routeto(${})"><img src="${}" alt="home"></img></li>\
                ').$({
                    0: "'${}'".$({ 0: k }),
                    icon: document.head.querySelector('link[rel="icon"]').href
                });
        } else { 
            return ('\
                <li onclick="Router.routeto(${})">${}</li>\
                ').$({
                    0: "'${}'".$({ 0: k }),
                    1: routes[k].name
                });
        }
    });

    // inline styles
    var listStyle = Style({
        padding: "0px",
        bottom: '0'
    });

    this.markup = ('\
        <div id="navbar">\
            <ul style="${}">\
                ${}\
            </ul>\
            <span id="nav-span"></span>\
        </div>\
        <Router />\
    ').$({
        0: listStyle,
        1: lis.map(function(li) { 
            return li;
        }).join("")
    });
    this.style = './src/components/NavBar/NavBar.css';
}