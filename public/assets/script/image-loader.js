const imgInput = document.querySelector('#imageFile');
const imgPlaceholder = document.querySelector('#imagePlaceholder');
const defaultText = imgPlaceholder.children[0].innerText;
let isImgOk = false;
let imgBase64 = null;

imgPlaceholder.onclick = () => imgInput.click();

function toDefault() {
    isImgOk = false;
    imgPlaceholder.innerHTML = '';
    const div = document.createElement('div');
    div.classList.add('noImage', 'img-responsive', 'mx-auto');
    div.innerText = defaultText;
    imgPlaceholder.appendChild(div);
    imgBase64 = null;
}

imgInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) {
        toDefault();
        return false;
    }
    let fileSizeMB = file.size / 1024 ** 2;
    if (fileSizeMB >= 10) {
        alert("Seu arquivo é grande demais para upload.")
        toDefault();
        return;
    }
    if (file && file.type.includes('image') && !file.type.includes('gif')) {
        imageLoader(file);
        isImgOk = true;
        return;
    }
    //if invalid img
    alert('Selecione um arquivo válido!')
    toDefault();
})


/**
 * Resize a base 64 Image. Returns a promise.
 * A few test results in reduction of 88% of the image size
 * @param {String} base64Url - The base64 string (must include MIME type)
 * @param {Number} width - The width of the image in pixels
 * @param {Number} height - The height of the image in pixels
 */
function decreaseImageSize(base64RUrl, width, height) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        let context = canvas.getContext("2d");
        const img = document.createElement("img");
        img.src = base64RUrl;
        img.onload = function () {
            context.scale(width / img.width, height / img.height);
            context.drawImage(img, 0, 0);
            resolve(canvas.toDataURL());
        }
    })
}

function createFilename(file) {
    const timestamp = new Date().getTime();

    //get only the extname. "image/png" should return "png"
    const extname = file.type.match(/\/(.+)/)[1];
    return `${timestamp}.${extname}`;
}

function imageLoader(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        imgPlaceholder.innerHTML = '';
        const img = document.createElement('img');
        img.classList.add('img-responsive', 'mx-auto', 'd-block');
        const src = e.target.result;
        decreaseImageSize(src, 300, 300)
            .then(newSrc => {
                img.src = newSrc;
                const filename = createFilename(file);
                imgBase64 = {
                    url: newSrc,
                    filename
                };
                imgPlaceholder.appendChild(img);
            })
            .catch(e => {
                throw new Error(e);
            })
    }
    reader.readAsDataURL(file);
}
/**Main function to deal with all events
 * 
 */

export class Images {
    async getImageInfo() {
        if (!isImgOk) {
            alert('Por favor, insira um formato de arquivo válido.')
            toDefault();
        }
        if (!imgBase64) throw new Error('invalid base64');

        const { url, filename } = imgBase64;
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url,
                filename
            })
        };

        try {
            const res = await fetch('/api/image', options);
            const newUrl = await res.json();
            return newUrl;

        } catch (e) {
            console.error(e);
            throw new Error(e);
        }
    }
    async deleteImage(public_id) {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ public_id })
        }
        const res = await fetch('/api/image', options);
        if (res.status >= 400) {
            console.error(res.statusText);
            return false;
        }
        return true;
    }
}

