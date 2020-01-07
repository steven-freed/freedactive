
function MyButton() {
    const markup = (`
        <div id="MyButton">
            <button>MyButton</button>
        </div>
    `);
    const style = './src/components/MyButton/MyButton.css';
    const children = [
    ];
    return {
        getMarkup: () => markup,
        getStyle: () => style,
        getChildren: () => children
    }
}

export default MyButton;