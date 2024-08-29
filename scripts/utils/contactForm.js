function displayModal() {
    const photographerName = document.querySelector('.photographer-name').textContent;
    document.getElementById('photographer-name-modal').textContent = photographerName;
    const modal = document.getElementById("contact_modal");
    modal.setAttribute('aria-hidden', 'false');
	modal.style.display = "block";

    // Définir le focus sur le premier champ de saisie lorsque le modal s'ouvre
    const firstNameInput = document.getElementById('first-name');
    firstNameInput.focus();

    // Focus ciblé dans le modal
    const focusableElements = modal.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    // Assurez-vous que le focus est ciblé dans le modal
    modalContent.addEventListener('keydown', function(e) {
        if (e.key === 'Tab' || e.keyCode === 9) {
            // si la touche Maj est enfoncée pour la combinaison Maj + Tabulation
            if (e.shiftKey) { 
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } 
                // si la touche de tabulation est enfoncée
                else { 
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
            }
        }
    });
}

// Assurez-vous que le focus ciblé dans le modal
function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = "none";
    document.querySelector('.contact_button').focus(); // Remettre le focus sur l'élément déclencheur
}

// Fermer modal avec la touche Échap
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('contact_modal');
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
        closeModal();
    }
});

document.querySelector('.modal header img').addEventListener('click', closeModal);