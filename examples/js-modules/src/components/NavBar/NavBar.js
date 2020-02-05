import App from '../../App.js';
import Docs from '../Docs/Docs.js';
import Hello from '../Hello/Hello.js';
import World from '../Hello/World/World.js';

export default class NavBar extends Component { 

    constructor() {
        super();

        // inline styles
        const listStyle = Style({
            padding: "0px",
            bottom: '0'
        });

        this.markup = (`
            <div id="navbar">
                <ul style="${listStyle}">
                    ${
                    this.getItems().map((li) => { 
                        return li;
                    }).join("")
                    }
                </ul>
                <span></span>
            </div>
            ${Router.markup}
        `);
        this.style = './src/components/NavBar/NavBar.css';
    }

    getItems() {
        // Sets your routes
        Router.init({
            '/': App,
            '/docs': Docs,
            '/hello': Hello,
            '/hello/world': World
        });
        
        // navbar navigation
        const routes = {
            '/': App,
            '/docs': Docs,
            '/hello': Hello
        };

        // li elements for routes
        const lis = Object.keys(routes).map((k) => {
            if (k === '/') {
                return (`
                    <li onclick="Router.routeto('${k}')">
                        <img src="${document.head.querySelector('link[rel="icon"]').href}" alt="home"></img>
                    </li>
                `);
            } else { 
                return (`
                    <li onclick="Router.routeto('${k}')">${routes[k].name}</li>
                `);
            }
        });

        return lis;
    }

}