export default class Hello extends Component {

    getMarkup() {
        return (`
            <div id="hello">
                <button id="hw-button" onclick="Router.routeto('/hello/world');">Hello?</button>
            </div>
        `);
    }

    getStyle() {
        return './src/components/Hello/Hello.css';
    }
};
