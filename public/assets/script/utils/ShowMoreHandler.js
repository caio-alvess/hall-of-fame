export class TextHandler {
    constructor(buttonClasslist) {
        /* this.userText = userText;
        this.whereHTML = whereHTML; */
        this.buttonClasslist = buttonClasslist;

        //bind
        this.splitText = this.splitText.bind(this);
        this.createHTMLStr = this.createHTMLStr.bind(this);
        this.deploy = this.deploy.bind(this);
    }

    get btnClass() {
        let btnClasses = this.buttonClasslist;
        if (!btnClasses) {
            return '';
        }
        return btnClasses.join(' ');
    }

    splitText(userText) {
        let text = userText.split(' ');
        const maxWord = text.length > 15 ? 10 : Math.floor(text.length - text.length * 0.75);
        console.log(maxWord);
        return {
            short: text.slice(0, maxWord).join(' '),
            long: text = text.slice(11, text.length - 1).join(' ')
        }
    }
    createHTMLStr(textObj) {
        const shortEl = document.createElement('p');
        const longEl = document.createElement('p');
        shortEl.innerText = textObj.short;
        longEl.innerText = textObj.long;

        return `
            <p id="shortText">
                ${shortEl.innerText}
                <span id="longText" style="display:none">
                    ${longEl.innerText}
                    <button class="${this.btnClass}" id="showLess">Mostrar menos</button>
                </span>
                <button class="${this.btnClass}" id="showMore">Mostrar mais</button>
            </p>
        `
    }
    deploy(whereHTML) {
        let userText = this.userText
        let textObj = this.splitText(userText);
        let htmlStr = this.createHTMLStr(textObj);

        whereHTML.innerHTML = htmlStr;
    }
    start() {
        const showMorebtn = document.querySelector('#showMore');
        const showLessbtn = document.querySelector('#showLess')
        const long = document.querySelector('#longText');

        showMorebtn.addEventListener('click', function (e) {
            this.style.display = 'none';
            long.style.display = 'unset';
        })
        showLessbtn.addEventListener('click', function () {
            long.style.display = 'none';
            showMore.style.display = 'unset';
        })
    }
    getHTMLOnly(userText) {
        let textObj = this.splitText(userText);
        let html = this.createHTMLStr(textObj);
        return html;
    }
}