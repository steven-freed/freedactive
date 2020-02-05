export default class Hello extends Component {

    constructor() {
        super();
        this.markup = (`
            <div id="hello">
                <button id="hw-button" onclick="Router.routeto('/hello/world');">Hello?</button>
            </div>
        `);
        this.style = './src/components/Hello/Hello.css';
    }

}