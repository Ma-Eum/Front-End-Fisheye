function mediaFactory(media) {
    const { title, image, video, likes } = media;
    let totalLikes = likes;

    function getMediaDOM() {
        const article = document.createElement('article');
        article.classList.add('media-item');

        let mediaElement;

        if (image) {
            mediaElement = document.createElement('img');
            mediaElement.setAttribute('src', `assets/images/Photos/${image}`);
            mediaElement.setAttribute('alt', title);
        } else if (video) {
            mediaElement = document.createElement('video');
            mediaElement.setAttribute('controls', true);
            const source = document.createElement('source');
            source.setAttribute('src', `assets/videos/${video}`);
            source.setAttribute('type', 'video/mp4');
            mediaElement.appendChild(source);
        }

        const titleEl = document.createElement('h3');
        titleEl.textContent = title;

        const likesEl = document.createElement('span');
        likesEl.classList.add('likes');
        likesEl.textContent = `${totalLikes} ❤`;

        const detailsEl = document.createElement('div');
        detailsEl.classList.add('media-item-details');
        detailsEl.appendChild(titleEl);
        detailsEl.appendChild(likesEl);

        article.appendChild(mediaElement);
        article.appendChild(detailsEl);

        return article;
    }

    return { getMediaDOM };
}