import { UserScreen } from './modules/screen.js';

const userScreen = UserScreen({
    log: '#log',
    userInput: '#email',
    submit: '.submit',
    loadingScreen: '.loading-screen'
})

userScreen.startEmailCounter = () => {
    const email = userScreen.userInput;
    const counter = document.querySelector('#emailCounter');
    email.addEventListener('input', () => {
        counter.innerText = email.value.length;
    })
};
userScreen.startEmailCounter();

const clearBtn = document.querySelector('#clear');
clearBtn.onclick = (e) => {
    e.preventDefault();
    userScreen.userInput.value = '';
}

document.onsubmit = (e) => {
    (async () => {
        e.preventDefault();
        userScreen.loadingToggle();
        userScreen.log();

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: userScreen.userInput.value })
        };
        try {
            const rawRes = await fetch('/email', options);
            const res = await rawRes.json();
            if (!res.isValid) {
                userScreen.log(res.message);
                throw new Error("duplicated email");
            }
            else if (rawRes.status >= 500) {
                userScreen.log('Tivemos um erro no servidor.\nSe o erro persistir, por favor, entre em contato.')
                throw new Error('server Error');
            }
            let { url } = res;
            window.location.href = url;
        } catch (error) {
            userScreen.loadingToggle();
        }
    })()
}