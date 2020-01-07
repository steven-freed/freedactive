import {
    Style,
    Router,
} from '../../../freedactive/freedactive.js';

import App from '../../App.js';
import About from '../About/About.js';
import Contact from '../Contact/Contact.js';

function NavBar() { 
    // routes
    const routes = {
        '/': App,
        '/about': About,
        '/contact': Contact
    };

    // router
    const router = Router(routes);

    // logo
    const logo = '../../../assets/favicon.ico';

    // inline styles
    const listStyle = Style({
            padding: "0px 25px 34px 25px"
    });
    
    // li elements for routes
    const navRoutes = Object.assign({}, routes);
    delete navRoutes['/'];
    const lis = Object.keys(navRoutes).map((k) => `<li><a href="#${k}">${routes[k].name}</a></li>`);

    const markup = (`
        ${
            router
        }
        <div id="navbar">
            <span></span>
            <ul style="${listStyle}">
                    <li><a href="#"><img src="${logo}" alt="home"></img></a></li>
                    ${lis.map((li) => li).join('')}
            </ul>
        </div>
    `);
    const style = './src/components/NavBar/NavBar.css';
    const children = [
    ];
    return {
        getMarkup: () => markup,
        getStyle: () => style,
        getChildren: () => children,
    };

}

export default NavBar;
