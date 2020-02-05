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
                <li onclick="Router.routeto(${key})"><img src="${icon}" alt="home"></img></li>\
                ').$({
                    key: "'${path}'".$({ path: k }),
                    icon: document.head.querySelector('link[rel="icon"]').href
                });
        } else { 
            return ('\
                <li onclick="Router.routeto(${key})">${route}</li>\
                ').$({
                    key: "'${path}'".$({ path: k }),
                    route: routes[k].name
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
            <ul style="${listStyle}">\
                ${items}\
            </ul>\
            <span id="nav-span"></span>\
        </div>\
        ${Router}\
    ').$({
        Router: Router.markup,
        listStyle: listStyle,
        items: lis.map(function(li) { 
            return li;
        }).join("")
    });
    this.style = './src/components/NavBar/NavBar.css';
}