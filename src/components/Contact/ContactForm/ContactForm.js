
function ContactForm() {
    this.getMarkup = function() {
        return ('\
            <div id="contact-form">\
                <input type="text" value="First Name">\
                <input type="text" value="Last Name">\
                <input type="text" value="email">\
                <button id="contact-form-button">Contact Us</button>\
            </div>\
        ');
    }
    this.getStyle = function() {
        return './src/components/Contact/ContactForm/ContactForm.css';
    }
};
