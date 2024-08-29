// Code JavaScript lié à la page photographer.html

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
    return data.media.filter(media => media.photographerId == id);
}

// Fonction pour trier les médias
function sortMedia(media, criteria) {
    switch (criteria) {
        case 'popularity':
            return media.sort((a, b) => b.likes - a.likes);
        case 'date':
            return media.sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'title':
            return media.sort((a, b) => a.title.localeCompare(b.title));
        default:
            return media;
    }
}

// Afficher les données du photographe et des médias
async function displayPhotographerData(sortCriteria = 'popularity') {
    const urlParams = new URLSearchParams(window.location.search);
    const photographerId = urlParams.get('id');

    const photographer = await getPhotographerById(photographerId);
    let media = await getMediaByPhotographerId(photographerId);

    // Trier les médias en fonction du critère sélectionné
    media = sortMedia(media, sortCriteria);

    // Mise à jour des informations du photographe
    document.querySelector('.photographer-name').textContent = photographer.name;
    document.querySelector('.photographer-location').textContent = `${photographer.city}, ${photographer.country}`;
    document.querySelector('.photographer-tagline').textContent = photographer.tagline;
    document.querySelector('.photographer-portrait img').setAttribute('src', `assets/images/Photos/${photographer.portrait}`);
    document.querySelector('.photographer-portrait img').setAttribute('alt', photographer.name);

    // Mise à jour du nom dans la modale
    document.getElementById('photographer-name-modal').textContent = photographer.name;

    // Mise à jour de la galerie de médias
    const mediaGallery = document.querySelector('.media-gallery');
    mediaGallery.innerHTML = '';  // Effacer les éléments multimédias existants
    media.forEach(mediaItem => {
        const mediaModel = mediaFactory(mediaItem);
        const mediaDOM = mediaModel.getMediaDOM();
        mediaGallery.appendChild(mediaDOM);
    });

    // Mise à jour du tarif journalier
    document.getElementById('daily-price').textContent = `${photographer.price}€/jour`;

    // Calcul du nombre total de likes
    const totalLikes = media.reduce((total, item) => total + item.likes, 0);
    document.getElementById('total-likes').textContent = totalLikes;

    // Attacher les événements de la Lightbox après le rendu des médias
    initializeLightbox();
}

function initializeLightbox() {
    const lightbox = document.getElementById('lightbox_modal');
    const lightboxMedia = lightbox.querySelector('.lightbox-media');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    let currentIndex = 0;
    let mediaItems = [];
    let autoSlideTimer;

    function openLightbox(index) {
        currentIndex = index;
        updateLightboxContent(mediaItems[currentIndex]);
        lightbox.setAttribute('aria-hidden', 'false');
        lightbox.style.display = 'flex'; // Affiche la lightbox
        lightbox.focus();
        startAutoSlide(); // Démarrer le slide automatique lorsque la lightbox s'ouvre
    }

    function closeLightbox() {
        lightbox.setAttribute('aria-hidden', 'true');
        lightbox.style.display = 'none'; // Cache la lightbox
        clearTimeout(autoSlideTimer); // Effacer la minuterie lorsque la lightbox se ferme
    }

    function updateLightboxContent(mediaItem) {
        lightboxMedia.innerHTML = '';
        if (mediaItem.image) {
            const img = document.createElement('img');
            img.src = mediaItem.image;
            img.alt = mediaItem.title;
            lightboxMedia.appendChild(img);
        } else if (mediaItem.video) {
            const video = document.createElement('video');
            video.controls = true;
            video.innerHTML = `<source src="${mediaItem.video}" type="video/mp4">`;
            lightboxMedia.appendChild(video);
        }
        lightboxCaption.textContent = mediaItem.title;
    }

    function showNextMedia() {
        currentIndex = (currentIndex + 1) % mediaItems.length;
        updateLightboxContent(mediaItems[currentIndex]);
    }

    function showPreviousMedia() {
        currentIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
        updateLightboxContent(mediaItems[currentIndex]);
    }

    function startAutoSlide() {
        clearTimeout(autoSlideTimer); // Réinitialisez la minuterie si une interaction se produit
        autoSlideTimer = setTimeout(() => {
            showNextMedia();
            startAutoSlide(); // Continuer le slide automatique
        }, 10000); // 10 secondes d'inactivité déclenchent le slide
    }

    // Réinitialisez le minuteur du slide automatique lors de toute interaction
    function resetAutoSlide() {
        startAutoSlide();
    }

    // Collectez tous les éléments multimédias et liez les événements
    document.querySelectorAll('.media-item img, .media-item video').forEach((element, index) => {
        mediaItems.push({
            image: element.tagName === 'IMG' ? element.src : null,
            video: element.tagName === 'VIDEO' ? element.querySelector('source').src : null,
            title: element.alt || element.getAttribute('aria-label') || 'Media'
        });

        element.addEventListener('click', () => openLightbox(index));
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                openLightbox(index);
            }
        });
    });

    // Écouteurs d'événements pour les contrôles Lightbox
    const closeButton = document.querySelector('.lightbox-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeLightbox);
    } else {
        console.error('Close button not found');
    }

    document.querySelector('.lightbox-prev').addEventListener('click', showPreviousMedia);
    document.querySelector('.lightbox-next').addEventListener('click', showNextMedia);

    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
        if (lightbox.getAttribute('aria-hidden') === 'false') {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showPreviousMedia();
            } else if (e.key === 'ArrowRight') {
                showNextMedia();
            }
        }
    });
}

// Initialiser l'affichage des données du photographe et des médias
document.addEventListener('DOMContentLoaded', function () {
    const selectContainer = document.querySelector('.custom-select');
    const selected = document.querySelector('.select-selected');
    const optionsContainer = document.querySelector('.select-options');
    const options = Array.from(document.querySelectorAll('.select-option'));

    selected.addEventListener('click', function () {
        // Supprimer l'option actuellement sélectionnée de la liste des options
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
            // Effectuez votre logique de tri ici en fonction de la valeur sélectionnée

            // Appliquer le tri en fonction de la sélection
            const sortCriteria = this.getAttribute('data-value');
            displayPhotographerData(sortCriteria);
        });

    });
       document.addEventListener('click', function (e) {
        if (!selectContainer.contains(e.target)) {
            selectContainer.classList.remove('select-active');
        }
    });

    // Charger les données initialement avec le tri par popularité
    displayPhotographerData('popularity');
});

// Fonction pour afficher la modale de contact
function displayModal() {
    const photographerName = document.querySelector('.photographer-name').textContent;
    document.getElementById('photographer-name-modal').textContent = photographerName;
    document.getElementById('contact_modal').style.display = "block";
    document.querySelector('.modal').focus();
}

// Gestion de la soumission du formaulaire de contact
document.querySelector('.modal form').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    // Ici, vous pouvez récupérer les données du formulaire
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Affiche les données dans la console pour vérification
    console.log('Prénom:', firstName);
    console.log('Nom:', lastName);
    console.log('Email:', email);
    console.log('Message:', message);

    // Vous pouvez ensuite fermer la modale ou réinitialiser le formulaire si nécessaire
    document.getElementById('contact_modal').style.display = "none";
    document.querySelector('.modal form').reset();
});