class Hello extends Component {

    constructor() {
        super();
    }

    markup() {
        return (`
            <div id="hello">
            <Link 
                id="hw-button"
                class="fa-link"
                path="/hello/world"
                >Hello</Link>
            </div>
        `);
    }

}