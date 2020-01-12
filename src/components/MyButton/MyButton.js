
function MyButton() {
    this.getMarkup = function() {
        return ('\
            <div>\
                <button id="my-button">MyButton</button>\
            </div>\
        ');
    }
    this.getStyle = function() {
        return './src/components/MyButton/MyButton.css';
    }
}
