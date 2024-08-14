//Mettre le code JavaScript lié à la page photographer.html

function photographerTemplate(data) {
    const { name, portrait, city, country, tagline, price } = data;
    const picture = `assets/images/Photos/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement('article');
        
        const img = document.createElement('img');
        img.setAttribute("src", picture);
        img.setAttribute("alt", `${name}`);
        img.setAttribute("aria-label", `${name}`);
        
        const h2 = document.createElement('h2');
        h2.textContent = name;

        const location = document.createElement('p');
        location.textContent = `${city}, ${country}`;
        location.classList.add('location');

        const taglineEl = document.createElement('p');
        taglineEl.textContent = tagline;
        taglineEl.classList.add('tagline');

        const priceEl = document.createElement('p');
        priceEl.textContent = `${price}€/jour`;
        priceEl.classList.add('price');

        article.appendChild(img);
        article.appendChild(h2);
        article.appendChild(location);
        article.appendChild(taglineEl);
        article.appendChild(priceEl);

        return (article);
    }

    return { name, picture, getUserCardDOM };
}

async function getPhotographerById(id) {
    const response = await fetch('data/photographers.json');
    const data = await response.json();
    return data.photographers.find(photographer => photographer.id == id);
}

async function getMediaByPhotographerId(id) {
    const response = await fetch('data/photographers.json');
    const data = await response.json();
    // Nous filtrons les médias appartenant au photographe avec l'ID correspondant
    return data.media.filter(media => media.photographerId == id);
}

async function displayPhotographerData() {
    // Récupère l'ID du photographe depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const photographerId = urlParams.get('id');

    // Récupère les données du photographe et des médias
    const photographer = await getPhotographerById(photographerId);
    const media = await getMediaByPhotographerId(photographerId);

    // Mise à jour des informations du photographe
    document.querySelector('.photographer-name').textContent = photographer.name;
    document.querySelector('.photographer-location').textContent = `${photographer.city}, ${photographer.country}`;
    document.querySelector('.photographer-tagline').textContent = photographer.tagline;
    document.querySelector('.photographer-portrait img').setAttribute('src', `assets/images/Photos/${photographer.portrait}`);
    document.querySelector('.photographer-portrait img').setAttribute('alt', photographer.name);

    // Mise à jour de la galerie de médias
    const mediaGallery = document.querySelector('.media-gallery');
    media.forEach(mediaItem => {
        const mediaModel = mediaFactory(mediaItem);
        const mediaDOM = mediaModel.getMediaDOM();
        mediaGallery.appendChild(mediaDOM);
    });

    // Mise à jour du tarif journalier
    document.getElementById('daily-price').textContent = `${photographer.price}€/jour`;
}
displayPhotographerData();

document.addEventListener('DOMContentLoaded', function () {
    const selectContainer = document.querySelector('.custom-select');
    const selected = document.querySelector('.select-selected');
    const optionsContainer = document.querySelector('.select-options');
    const options = Array.from(document.querySelectorAll('.select-option'));

    selected.addEventListener('click', function () {
        // Remove the current selected option from the options list
        optionsContainer.innerHTML = '';
        const currentValue = selected.getAttribute('data-value');
        
        options
            .filter(option => option.getAttribute('data-value') !== currentValue)
            .forEach(option => {
                optionsContainer.appendChild(option);
            });

        selectContainer.classList.toggle('select-active');
    });

    options.forEach(option => {
        option.addEventListener('click', function () {
            selected.innerHTML = this.innerHTML + '<span class="select-arrow">▼</span>';
            selected.setAttribute('data-value', this.getAttribute('data-value'));
            selectContainer.classList.remove('select-active');
            // Perform your sorting logic here based on selected value
        });
    });

    document.addEventListener('click', function (e) {
        if (!selectContainer.contains(e.target)) {
            selectContainer.classList.remove('select-active');
        }
    });
});



