
function MyButton() {
    const markup = (`
        <div>
            <button id="my-button">MyButton</button>
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