class Hello extends Component {

    constructor() {
        super();
        this.markup = (`
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