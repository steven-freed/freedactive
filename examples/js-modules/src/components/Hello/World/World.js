class World extends Component {
    
    constructor() {
        super();
        this.markup = (`
            <div id="world">
                <button id="message" onclick="changeColor()">World!</button>
            </div>
        `);
    }
    
    changeColor() {
        if (document.getElementById('message').style.color === 'red') {
            document.getElementById('message').style.color = 'white';
        } else {
            document.getElementById('message').style.color = 'red';
        }
    }

}