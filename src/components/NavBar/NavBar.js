
function NavBar() { 

    // routes
    Router.set({
        '/': App,
        '/about': About,
        '/contact': Contact,
        '/contact/form': ContactForm
    });

    // logo
    var logo = '../../../assets/favicon.png';

    // inline styles
    var listStyle = Style({
        padding: "0px 25px 34px 25px"
    });
    
    // navbar navigation
    var routes = {
        '/': App,
        '/about': About,
        '/contact': Contact
    };

    // li elements for routes
    var lis = Object.keys(routes).map(function(k) {
        if (k === '/')
            return ('<li onclick="routeto(\'${key}\')"><img src="${logo}" alt="home"></img></li>'.$({
                key: k,
                logo: logo
            }));
        return ('<li onclick="routeto(\'${key}\')">${route}</li>'.$({
            key: k,
            route: routes[k].name
        }));
    });

    this.getMarkup = function() {
        return ('\
            ${Router}\
            <div id="navbar">\
                <span></span>\
                <ul style="${listStyle}">\
                    ${items}\
                </ul>\
            </div>').$({
                Router: Router.getMarkup(),
                listStyle: listStyle,
                items: lis.map(function(li) { 
                    return li
                }).join("")
            });
    }
    this.getStyle = function() {
        return './src/components/NavBar/NavBar.css';
    }
}
