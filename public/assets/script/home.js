import { TextHandler } from './utils/ShowMoreHandler.js';

async function getUsers() {
    const rawRes = await fetch('/api/users');
    return await rawRes.json();
}

function getSocialDetails(socialmedia, socialmediauser) {
    const mediasInfo = {
        linkedin: {
            img: '../../assets/imgs/socialmedias/linkedin.svg',
            url: 'https://www.linkedin.com/in/'
        },
        instagram: {
            img: '../../assets/imgs/socialmedias/instagram.svg',
            url: 'https://www.instagram.com/'
        },
        facebook: {
            img: '../../assets/imgs/socialmedias/instagram.svg',
            url: 'https://www.facebook.com/'
        },
        twitter: {
            img: '../../assets/imgs/socialmedias/twitter-x.svg',
            url: 'https://twitter.com/'
        },
        github: {
            img: '../../assets/imgs/socialmedias/github.svg',
            url: 'https://github.com/'
        },
        behance: {
            img: '../../assets/imgs/socialmedias/behance.svg',
            url: 'https://www.behance.net/'
        }
    };
    if (!socialmedia in mediasInfo) {
        throw new Error(socialmedia + ' invalid socialmedia');
    }
    return {
        url: mediasInfo[socialmedia].url + socialmediauser,
        img: mediasInfo[socialmedia].img
    }
}
let textHandler = new TextHandler(['show']);

function cardStruct(user) {
    let { name, img_url, socialmedia, socialmediauser, message } = user;
    let p = textHandler.getHTMLOnly(message);

    let socialInfo = getSocialDetails(socialmedia, socialmediauser);

    const main = `
            <div class="card">
                <div class="row mx-auto text-center">
                    <img src="${img_url}" alt="user avatar" fetchpriority="low"
                        rel="preload" class="img-responsive mt-2">
                </div>
                <div class="card-body">
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text no-wrap">
                        <img src="${socialInfo.img}" alt="social media image">
                        <a href="${socialInfo.url}" target="_blank">${socialmediauser}</a>
                    </p>
                    <p class="message">${p}</p>
                </div>
            </div>
    `
    const div = document.createElement('div');
    div.classList.add('col-md-3', 'mb-3');
    div.innerHTML = main;

    return div;
}


window.onload = async () => {
    const loading = document.querySelector('.loading');
    const cardPlaceholder = document.querySelector('.usersph');
    const users = await getUsers();
    users.rows.forEach(user => {
        const cardDiv = cardStruct(user);
        loading.style.display = 'none';
        cardPlaceholder.appendChild(cardDiv);
        textHandler.start();
    });
}