function NavBar() { 

    // Sets your routes
    Router.set({
        '/': App,
        '/docs': Docs,
        '/hello': Hello,
        '/hello/world': World
    });
    
    // navbar navigation
    var routes = {
        '/': App,
        '/docs': Docs,
        '/hello': Hello
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

    this.getMarkup = function() {
        return ('\
            <div id="navbar">\
                <ul style="${listStyle}">\
                    ${items}\
                </ul>\
                <span></span>\
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
