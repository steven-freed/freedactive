NavBar.prototype = new Component;

function NavBar() {
        
    // navbar navigation list items
    var routes = {
        '/': App,
        '/docs': Docs,
        '/hello': Hello
    };

    // generate list item elements for routes
    var lis = Object.keys(routes).map(function(k) {
        if (k === '/') {
            return ('\
                <li>\
                    <Link path="${}" class="fa-link" >\
                        <img src="${}" alt="home"></img>\
                    </Link>\
                </li>\
            ').$({
                0: k,
                1: document.head.querySelector('link[rel="icon"]').href,
            });
        } else { 
            return ('\
                <li>\
                    <Link path="${}" class="fa-link">${}</Link>\
                </li>\
            ').$({
                0: k,
                1: routes[k].name
            });
        }
    });

    // inline style for list
    var listStyle = Style({
        padding: "0px",
        bottom: '0'
    });

    this.markup = ('\
        <div>\
            <div id="navbar">\
                <ul style="${}">\
                    ${}\
                </ul>\
            </div>\
            <Switch routes="${}" />\
        </div>\
    ').$({
        0: listStyle,
        // concatinates all list items
        1: lis.map(function(li) { 
            return li;
        }).join(""),
        // gives switch all routes
        2: Route({
            '/hello': Hello,
            '/docs': Docs,
            '/hello/world': World
        })
    });

}