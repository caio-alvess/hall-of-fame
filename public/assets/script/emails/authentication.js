import { UserScreen } from "./modules/screen.js";

const userScreen = UserScreen({
    input: '#authCode',
    submit: '#confirmCode',
    loadingScreen: '.loading-screen',
    log: '#log'
})

class Authentication {
    isValid = false;
    constructor(wrongEmailId, resendCodeId, userCodeId) {
        this.wrongEmail = document.querySelector(`#${wrongEmailId}`);
        this.resend = document.querySelector(`#${resendCodeId}`);
        this.authCode = document.querySelector(`#${userCodeId}`)
        this.form = document.querySelector('form');

        //bind
        this.resendCode = this.resendCode.bind(this);
        this.redirected = this.redirected.bind(this);
    }
    async destroy(e) {
        e.preventDefault();
        const rawRes = await fetch('/email/confirm', { method: 'DELETE' });
        if (rawRes.status >= 400) {
            userScreen.log('Tivemos um erro interno no nosso servidor.\nPor favor, tente novamente.');
        }
        if (rawRes.redirected) {
            location.replace('/email');
        }
    }

    async resendCode(e) {
        e.preventDefault();
        const rawRes = await fetch('/email/resend-code')
        if (rawRes.status >= 200 && rawRes.status <= 299) {
            userScreen.log('Enviado com sucesso!\nVocê só pode fazer uma solicitação a cada 2 minutos.')
        }
        else {
            userScreen.log('Erro interno')
        }
    }
    async confirmCode(userCode) {
        const options = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                authCode: userCode
            })
        }
        userScreen.log();
        userScreen.loadingToggle();
        const rawRes = await fetch('/email/confirm', options);
        userScreen.loadingToggle();
        if (rawRes.status >= 400 && rawRes.status <= 499) {
            userScreen.log('Ops, o seu código está incorreto.\nVerifique o seu email e tente novamente.');
            return false;
        }
        if (rawRes.status >= 500) {
            userScreen.log('Tivemos um erro interno no nosso servidor.\nSe o erro persistir, por favor entre em contato.');
            return false;
        }
        if (rawRes.redirected) {
            return true;
        }
    }

    async redirected(e) {
        if (!this.isValid) {
            e.preventDefault()
        }
        const userCode = this.authCode;
        let isAuthorized = await this.confirmCode(userCode.value);
        if (isAuthorized) {
            this.isValid = true;
            document.querySelector('form').submit();
        }
    }

    start() {
        this.wrongEmail.addEventListener('click', this.destroy);
        this.resend.addEventListener('click', this.resendCode);
        this.form.onsubmit = this.redirected;

    }
}
new Authentication('wrongEmail', 'resendCode', 'authCode').start();