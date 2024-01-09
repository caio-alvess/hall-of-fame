async function getUsers() {
    const rawRes = await fetch('/api/users');
    return await rawRes.json();
}

function cardStruct(user) {
    let { name, img_url, socialmedia, socialmediauser, date } = user;

    const main = `
            <div class="card">
                <div class="row mx-auto text-center">
                    <img src="${img_url}" alt="user avatar" fetchpriority="low"
                        rel="preload" class="img-responsive mt-2">
                </div>
                <div class="card-body">
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text no-wrap">
                        ${socialmedia}: ${socialmediauser}
                    </p>
                </div>
            </div>
    `
    const div = document.createElement('div');
    div.classList.add('col-md-3', 'mb-3');
    div.innerHTML = main;

    return div;
}


window.onload = async () => {
    const cardPlaceholder = document.querySelector('.usersph');
    const users = await getUsers();
    users.rows.forEach(user => {
        const cardDiv = cardStruct(user);
        cardPlaceholder.appendChild(cardDiv);
    });
}