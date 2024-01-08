import { UserScreen } from "./modules/screen.js";

const wrongEmail = document.querySelector('#wrongEmail')
wrongEmail.addEventListener('click', async (e) => {
    e.preventDefault();
    const rawRes = await fetch('/email/confirm', { method: 'DELETE' });
    console.log(rawRes);
    if (rawRes.redirected) {
        location.replace('/email');
    };

    const res = await rawRes.json();
    if (rawRes.status >= 500) {
        userScreen.log(res.message);
    }
})

const userScreen = UserScreen({
    email: '#authCode',
    submit: '#confirmCode',
    loadingScreen: '.loading-screen',
    log: '#log'
})


document.querySelector('#resendCode').addEventListener('click', async (e) => {
    e.preventDefault();
    const rawRes = await fetch('/api/email/resend')
    if (rawRes.status >= 200 && rawRes.status <= 299) {
        userScreen.log('Enviado com sucesso')
    }
    else {
        userScreen.log('Erro interno')
    }
})


const url = '/email/confirm';

async function confirmCode(userCode) {
    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            authCode: userCode
        })
    }
    try {
        userScreen.log(false);
        userScreen.loading(true);
        const rawRes = await fetch(url, options);
        if (rawRes.redirected) {
            return true;
        }
        const res = await rawRes.json();
        console.log(res);
        userScreen.log(res.message);
        return false;
    }
    catch (e) {
        return false;
    }
    finally {
        userScreen.loading(false);
    }
}
let isValid = null;
document.querySelector('form').onsubmit = async (e) => {
    console.log('inside here');
    if (!isValid) {
        e.preventDefault()
    }
    const userCode = document.querySelector('#authCode');
    if (await confirmCode(userCode.value)) {
        isValid = true;
        document.querySelector('form').submit();
    };
};

