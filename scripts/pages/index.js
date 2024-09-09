    import { photographerTemplate } from '../templates/photographer.js';
    
    async function getPhotographers() {
    // Utiliser fetch pour récupérer les données à partir du fichier JSON
    const response = await fetch('data/photographers.json');
    const data = await response.json();
    return data;
    }

    async function displayData(photographers) {
        const photographersSection = document.querySelector(".photographer_section");

        photographers.forEach((photographer) => {
            const photographerModel = photographerTemplate(photographer);
            const userCardDOM = photographerModel.getUserCardDOM();
            photographersSection.appendChild(userCardDOM);
        });
    }

    async function init() {
        // Récupère les datas des photographes
        const { photographers } = await getPhotographers();
        displayData(photographers);
    }
    
    init();
    
    document.addEventListener('DOMContentLoaded', function() {
        const links = document.querySelectorAll('a[tabindex="0"]');
    
        links.forEach(link => {
            link.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    link.click();
                    e.preventDefault();  // Empêche le défilement de la page pour la touche Espace
                }
            });
        });
    });