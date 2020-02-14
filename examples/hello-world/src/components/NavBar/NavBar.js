NavBar.prototype = new Component;

function NavBar() {
        
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
                <li><Link path="${}" name="${}" class="fa-link"/></li>\
                ').$({
                    0: k,
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
        1: lis.map(function(li) { 
            return li;
        }).join(""),
        2: '{ \"/hello\": \"Hello\", \"/docs\": \"Docs\", \"/hello/world\": \"World\" }'
    });

}