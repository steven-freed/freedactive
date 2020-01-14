function NavBar() { 

    // Sets your routes
    Router.set({
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
                <li onclick="routeto(\'${key}\')"><img src="../../../assets/favicon.png" alt="home"></img></li>\
                ').$({
                    key: k
                });
        } else { 
            return ('\
                <li onclick="routeto(\'${key}\')">${route}</li>\
                ').$({
                    key: k,
                    route: routes[k].name
                });
        }
    });

    // inline styles
    var listStyle = Style({
        padding: "0px",
        bottom: '0'
    });

    this.getMarkup = function() {
        return ('\
            <div id="navbar">\
                <ul style="${listStyle}">\
                    ${items}\
                </ul>\
                <span id="nav-span"></span>\
            </div>\
            ${Router}\
        ').$({
            Router: Router.getMarkup(),
            listStyle: listStyle,
            items: lis.map(function(li) { 
                return li;
            }).join("")
        });
    }
    
    this.getStyle = function() {
        return './src/components/NavBar/NavBar.css';
    }
}
