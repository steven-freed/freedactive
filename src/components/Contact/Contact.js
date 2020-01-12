
function Contact() {

    this.getMarkup = function() {
        return ('\
            <div id="contact">\
                <input id="contact-input" type="text" value="What\'s Up?">\
                <button id="contact-button" onclick="notify()">Contact Us</button>\
                <button onclick="routeto(${comp});">Fill out form</button>\
            </div>').$({
                comp: "'/contact/form'"
            });
    }
    this.getStyle = function() {
        return './src/components/Contact/Contact.css';
    }
    this.notify = function() {
        let form = document.getElementsByTagName('input')[0];
        form.style.visibility = 'visible';
    }
    
};

