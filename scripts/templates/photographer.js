 export function photographerTemplate(data) {
    const { id,name, portrait, city, country, tagline, price } = data;
    const picture = `assets/images/Photos/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement('article');
        
        const link = document.createElement('a');
        link.setAttribute('href', `photographer.html?id=${id}`);
        link.setAttribute('aria-label', `Voir la page de ${name}`);
        console.log(`Lien généré : photographer.html?id=${id}`);

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
        
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

        imageContainer.appendChild(img);
        link.appendChild(imageContainer);
        link.appendChild(h2);
        link.appendChild(location);
        link.appendChild(taglineEl);
        link.appendChild(priceEl);
        article.appendChild(link);

        return article;
    }

    return { name, picture, getUserCardDOM };
}
