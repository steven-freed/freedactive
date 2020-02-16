NavBar.prototype = new Component;

function NavBar() {

}

NavBar.prototype.markup = function() {

    // inline style for list
    var listStyle = Style({
        padding: "0px",
        bottom: '0'
    });

    return ('\
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
        1: this.getItems().map(function(li) { 
            return li;
        }).join(""),
        // passes routes to switch
        2: Route({
            '/counter-view': CounterView
        })
    });
}

NavBar.prototype.getItems = function () {
    // navbar navigation list items
    var routes = {
        '/': App,
        '/counter-view': CounterView
    };

    // generate list item elements for routes
    return Object.keys(routes).map(function(k) {
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
                <li><Link path="${}"class="fa-link">${}</Link></li>\
            ').$({
                0: k,
                1: routes[k].name
            });
        }
    });
}