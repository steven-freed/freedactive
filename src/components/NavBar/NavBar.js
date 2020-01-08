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
    const logo = '../../../assets/favicon.png';

    // inline styles
    const listStyle = Style({
            padding: "0px 25px 34px 25px"
    });
    
    // li elements for routes
    const navRoutes = Object.assign({}, routes);
    delete navRoutes['/'];
    const lis = Object.keys(navRoutes).map((k) => `<li onclick="routeto('${k}')">${routes[k].name}</li>`);

    const markup = (`
        ${
            router
        }
        <div id="navbar">
            <span></span>
            <ul style="${listStyle}">
                    <li onclick="routeto('/')"><img src="${logo}" alt="home"></img></li>
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
