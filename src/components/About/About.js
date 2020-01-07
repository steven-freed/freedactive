
function About() {
    const markup = (`
        <div id="about">About</div>
    `);
    const style = '';
    const children = [
    ];
    return {
        getMarkup: () => markup,
        getStyle: () => style,
        getChildren: () => children,
    }
};

export default About;