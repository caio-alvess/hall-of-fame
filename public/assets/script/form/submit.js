import { Images } from '../image-loader.js';
import { UserScreen as screen } from '../emails/modules/screen.js';
const userScreen = screen({
    log: '#log',
    submit: '#submit',
    loadingScreen: '.loading-screen'
});

class Form {
    constructor() {
        this.textArea = document.querySelector('#message');
        this.counter = document.querySelector('#counter');

        //bind
        this.counterTextArea = this.counterTextArea.bind(this);
        this.submitForm = this.submitForm.bind(this);

    }
    counterTextArea() {
        let counter = this.counter;
        let textArea = this.textArea;
        counter.innerText = textArea.value.length;
    }

    async submitForm(e) {
        const formData = new FormData(document.querySelector('form'));
        const textArea = document.querySelector('#message');
        let imgInfo;
        const images = new Images();

        userScreen.loadingToggle()
        e.preventDefault();
        try {
            imgInfo = await images.getImageInfo();

        } catch (error) {
            userScreen.log('Erro ao processar imagem');
            userScreen.loadingToggle();
            return;
        }

        const userInfo = {
            name: formData.get('name'),
            socialmedia: formData.get('socialmedia'),
            socialmediaUser: formData.get('socialmediaUser'),
            message: formData.get(''),
            img_url: imgInfo.url,
            message: textArea.value
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userInfo)
        };

        try {

            const res = await fetch('/form', options)
            if (res.status === 201) {
                location.replace('/');
            }
            if (res.status === 400) {
                userScreen.log('Aparentemente você esqueceu de preencher algum campo no formulário.')
                userScreen.loadingToggle();
            }
            else if (res.status >= 500) {
                userScreen.log('Erro interno no servidor.\nPor favor, verifique sua conexão com a internet e tente novamente.')
                userScreen.loadingToggle();
                throw new Error();
            }
        } catch (error) {
            const res = await images.deleteImage(imgInfo.public_id);
            console.warn('photo deleted');
        }
    }
    start() {
        this.textArea.addEventListener('input', this.counterTextArea)
        document.onsubmit = this.submitForm;
    }
}
new Form().start();