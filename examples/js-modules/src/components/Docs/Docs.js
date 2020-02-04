export default class Docs extends Component {
    getMarkup() {
        return (`
            <div id="docs">
                <h3>Documentation:</h3>
                <a href="https://github.com/steven-freed/freedactive/blob/master/README.md">Freedactive Github README</a>
            </div>
        `);
    }

    getStyle() {
        return './src/components/Docs/Docs.css';
    }
};
