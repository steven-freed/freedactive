export default class Docs extends Component {
    
    constructor() {
        super();
        this.markup = (`
            <div id="docs">
                <h3>Documentation:</h3>
                <a href="https://github.com/steven-freed/freedactive/blob/master/README.md">Freedactive Github README</a>
            </div>
        `);
        this.style = './src/components/Docs/Docs.css';
    }
    
}