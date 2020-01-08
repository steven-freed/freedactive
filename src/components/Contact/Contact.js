
function Contact() {
    const markup = (`
        <div id="contact">
            <input type="text" value="What's Up?"> 
            <button id="contact-button" onclick="notify()">Contact Us</button>
        </div>
    `);
    const style = './src/components/Contact/Contact.css';
    const children = [
    ];
    return {
        getMarkup: () => markup,
        getStyle: () => style,
        getChildren: () => children,
        notify: function() {
            let form = document.getElementsByTagName('input')[0];
            form.style.visibility = 'visible';
        },
    }
};

export default Contact;
