import { Images } from '../image-loader.js';

document.onsubmit = async (e) => {
    const nameIpt = document.querySelector('#name');
    const socialmediaIpt = document.querySelector('#socialmedia');
    const socialmediaUsr = document.querySelector('#socialmedia-user');

    const images = new Images();

    let imgInfo;
    e.preventDefault();
    try {
        imgInfo = await images.getImageInfo();
        console.log(imgInfo);

    } catch (error) {
        console.error(error) // CONSERTAR COM PRIORIDADE
        throw new Error(error);
    }

    const userInfo = {
        name: nameIpt.value,
        socialmedia: socialmediaIpt.value,
        socialmediaUser: socialmediaUsr.value,
        img_url: imgInfo.url
    }

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userInfo)
    };

    (async () => {
        try {
            const res = await fetch('/form', options)
            if (res.status > 299) {
                throw new Error('error on request');
            }
        } catch (error) {
            const res = await images.deleteImage(imgInfo.public_id);
            if (res) {
                console.log('Photo not uploaded');
            } else {
                throw new TypeError('bad request');
            }
        }
    })()
} 