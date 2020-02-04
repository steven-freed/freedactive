export default class World extends Component {
    getMarkup() {
        return (`
            <div id="world">
                <h1>World!</h1>
            </div>
        `);
    }

    getStyle() {
        return './src/components/Hello/World/World.css';
    }
}
