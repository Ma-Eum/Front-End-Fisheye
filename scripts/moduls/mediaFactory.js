// Ajout de 'export' pour rendre la fonction réutilisable
export function mediaFactory(media) {
            const { title, image, video, likes } = media;
            let totalLikes = likes;
            // const objetClaire = {name: 'claire',profession:'developpeur web',langue:'francais'};
            // const listClaire=[1,2,3,4,5];
            // const listeObjet=[{name:'malek',profession:'dev'},{}];
            // console.log(media); 
        
            function getMediaDOM() {
                const article = document.createElement('article');
                article.classList.add('media-item');
        
                let mediaElement;
        
                if (image) {
                    mediaElement = document.createElement('img');
                    mediaElement.setAttribute('src', `assets/images/Photos/${image}`);
                    mediaElement.setAttribute('alt', title);
                    mediaElement.setAttribute('tabindex', '0'); // Assure que l'image est focusable
                } else if (video) {
                    mediaElement = document.createElement('video');
                    mediaElement.setAttribute('controls', true);
                    const source = document.createElement('source');
                    source.setAttribute('src', `assets/videos/${video}`);
                    source.setAttribute('type', 'video/mp4');
                    mediaElement.appendChild(source);
                    mediaElement.setAttribute('tabindex', '0'); // Assure que la vidéo est focusable
                }
        
                const titleEl = document.createElement('h3');
                titleEl.textContent = title;
        
                const likesEl = document.createElement('span');
                likesEl.classList.add('likes');
                likesEl.textContent = `${totalLikes} ❤`;
                likesEl.setAttribute('tabindex', '0'); // Rend le bouton "J'aime" focusable
                likesEl.addEventListener('click', () => {
                    totalLikes += 1;
                    likesEl.textContent = `${totalLikes} ❤`;
                    updateTotalLikes(1);
                });
        
                likesEl.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') {
                        likesEl.click(); // Déclenche le clic si la touche "Enter" est pressée
                    }
                });
        
                const detailsEl = document.createElement('div');
                detailsEl.classList.add('media-item-details');
                detailsEl.appendChild(titleEl);
                detailsEl.appendChild(likesEl);
        
                article.appendChild(mediaElement);
                article.appendChild(detailsEl);
        
                return article;
            }
        
            function updateTotalLikes(increment) {
                const totalLikesEl = document.getElementById('total-likes');
                let currentLikes = parseInt(totalLikesEl.textContent);
                totalLikesEl.textContent = currentLikes + increment;
            }
        
            return { getMediaDOM };
        }