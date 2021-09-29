'use strict';

const imageContainer = document.querySelector('.js-gallery');
const imagesCards = createGallaryMarkup(galleryItems);
const openModal = document.querySelector('.js-lightbox');
const backdrop = document.querySelector('.lightbox__overlay');
const imageRef = document.querySelector('.lightbox__image');
const closeBtn = document.querySelector('[data-action="close-lightbox"]');

imageContainer.insertAdjacentHTML('beforeend', imagesCards);

imageContainer.addEventListener('click', onImageContainerClick);
closeBtn.addEventListener('click', onCloseClick);
backdrop.addEventListener('click', onBackdropClick);

function createGallaryMarkup(galleryItems) {
    return galleryItems
        .map(({ preview, original, description }) => {
			return `
		<li class="gallery__item">
            <img class="gallery__image js_gallery_items" 
            src = "${preview}"
            data-source = "${original}"
            alt = ${description}">
        </li>
		`;
    })
        .join('');
};

function onImageContainerClick(e) {
    openModal.classList.add('is-open');
    const imageUrl = e.target.getAttribute('data-source');
    imageRef.src = imageUrl;
    window.addEventListener('keyup', controlModuleWindow)
};

function closeModalWindow() {
    openModal.classList.remove('is-open');
    imageRef.src = "";
    window.removeEventListener('keyup', controlModuleWindow);
};

function onCloseClick() {
    closeModalWindow();
};

function onBackdropClick(e) {
    if (e.target === e.currentTaget) {
        closeModalWindow();
    };
};

function controlModuleWindow(e) {
    const keyNavigation = document.querySelectorAll('.js_gallery_items');
    const imageArray = Array.from(keyNavigation);
    const imageSrcArray = imageArray.map(image => {
        const src = image.getAttribute('data-source');
        return src;
    });

    let currentImageIndex = imageSrcArray.indexOf(imageRef.src);

    const isEsc = e.keyCode === 27;
    const isRight = e.keyCode === 39;
    const isLeft = e.keyCode === 37;

    switch (true) {
        case isEsc:
            closeModalWindow();
            break;
        
        case isRight:
            currentImageIndex += 1;
            if (currentImageIndex > imageSrcArray.length-1) {
                currentImageIndex = 0;
			};
            imageRef.src = imageSrcArray[currentImageIndex];
            break;

        case isLeft:
            currentImageIndex -= 1;
            if (currentImageIndex < 0) {
                currentImageIndex = imageSrcArray.length - 1;
			};
            imageRef.src = imageSrcArray[currentImageIndex]
            break;
	};
};