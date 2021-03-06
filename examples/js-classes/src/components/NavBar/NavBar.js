class NavBar extends Component {
        
    constructor() {
        super();
    }

    markup() {

        const routes = Route({
            '/hello': Hello,
            '/docs': Docs,
            '/hello/world': World
        });

        // inline style for list
        const listStyle = Style({
            padding: "0px",
            bottom: '0'
        });

        return (`
            <div>
                <div id="navbar">
                    <ul style="${listStyle}">
                        ${
                        this.getItems({
                            '/': App,
                            '/docs': Docs,
                            '/hello': Hello
                        })
                        }
                    </ul>
                </div>
                <Switch routes="${routes}" />
            </div>
        `);
    }

    getItems(routes) {
        const listItems = Object.keys(routes).map(function(k) {
            if (k === '/') {
                return (`
                    <li>
                        <Link path="${k}" class="fa-link">
                            <img src="${document.head.querySelector('link[rel="icon"]').href}"
                                alt="home">
                                </img>
                        </Link>
                    </li>
                `);
            } else { 
                return (`
                    <li><Link path="${k}" class="fa-link">${routes[k].name}</Link></li>
                `);
            }
        });

        return listItems.map((li) => li).join('');
    }
    
}