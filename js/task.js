'use strict';

import { default as imageRef } from "./gallery-items.js";

class Gallery {
	constructor(
		imageList,
		gallerySelector,
		galleryItemSelector,
		galleryLinkSelector,
		galleryImageSelector,
		lightBoxSelector,
		lightBoxImageSelector,
		closeButtonSelector,
	) {
		this.imageRef = imageList;
		this.galleryEl = document.querySelector(gallerySelector);
		this.liteBoxEl = document.querySelector(lightBoxSelector);
		this.imageEl = document.querySelector(lightBoxImageSelector);
		this.closeButtonEl = document.querySelector(closeButtonSelector);
		this.galleryItemSelector = galleryItemSelector;
		this.galleryLinkSelector = galleryLinkSelector;
		this.galleryImageSelector = galleryImageSelector;

		this.galleryEl.insertAdjacentHTML(
			"afterBegin",
			this.createImagesListString(),
		);
	}
	createImagesListString() {
		return this.imageRef.reduce(
			(resultHTMLString, { preview, description, original }) => {
				resultHTMLString += `<li class='${this.galleryItemSelector}'><a class='${this.galleryLinkSelector}' href='${original}'><img class='${this.galleryImageSelector}' src='${preview}' alt='${description}' data-source='${original}'></a></li>`;

				return resultHTMLString;
			},
			"",
		);
	}
	setLightBoxImage({ original, description }) {
		this.imageEl.src = original;
		this.imageEl.alt = description;
	}
	clearLightBoxImage() {
		this.imageEl.src = "";
		this.imageEl.alt = "";
	}
	imageShift(imageObj, shift) {
		this.imageEl.style.opacity = "0";
		this.imageEl.style.transform = `translate3D(${shift}px, 0px, 0px)`;
		setTimeout(() => {
			this.clearLightBoxImage();
			setTimeout(() => {
				this.imageEl.style.transform = `translate3D(${-shift}px, 0px, 0px)`;
			}, 1);
		}, 150);
		setTimeout(() => {
			this.setLightBoxImage(imageObj);
			this.imageEl.style.opacity = "1";
			this.imageEl.style.transform = "translate3D(0px, 0px, 0px)";
		}, 400);
	}
	nextImage() {
		if (this.currentIndex === this.imageRef.length - 1) {
			this.imageShift(this.imageRef[0], this.liteBoxEl.clientWidth);
			this.currentIndex = 0;
			return;
		} else {
			this.imageShift(
				this.imageRef[this.currentIndex + 1],
				this.liteBoxEl.clientWidth,
			);
			this.currentIndex += 1;
			return;
		}
	}
	previousImage() {
		if (this.currentIndex === 0) {
			this.imageShift(
				this.imageRef[this.imageRef.length - 1],
				-this.liteBoxEl.clientWidth,
			);
			this.currentIndex = this.imageRef.length - 1;
			return;
		} else {
			this.imageShift(
				this.imageRef[this.currentIndex - 1],
				-this.liteBoxEl.clientWidth,
			);
			this.currentIndex -= 1;
			return;
		}
	}
	openLightBoxHandler(event) {
		if (event.target.nodeName !== "IMG") {
			return;
		}
		this.liteBoxEl.addEventListener("click", this.lightBoxHandler.bind(this));
		document.addEventListener("keydown", this.keyboardHandler.bind(this));
		event.preventDefault();
		this.liteBoxEl.classList.add("is-open");
		this.currentIndex = Array.from(this.galleryEl.children).indexOf(
			event.target.closest("li"),
		);
		this.setLightBoxImage(
			this.imageRef.find(item => item.original === event.target.dataset.source),
		);
	}
	closeLightBox() {
		this.liteBoxEl.removeEventListener(
			"click",
			this.lightBoxHandler.bind(this),
		);
		document.removeEventListener("keydown", this.keyboardHandler.bind(this));
		this.liteBoxEl.classList.remove("is-open");
		this.clearLightBoxImage();
	}
	lightBoxHandler(event) {
		if (
			event.target.dataset.action === "close-lightbox" ||
			event.target.nodeName === "DIV"
		) {
			this.closeLightBox();

			return;
		}
		if (event.target.nodeName === "IMG") {
			if (event.clientX > this.liteBoxEl.clientWidth / 2) {
				this.nextImage();
			} else {
				this.previousImage();
			}
		}
	}
	keyboardHandler(event) {
		if (this.liteBoxEl.classList.contains("is-open")) {
			switch (event.key) {
				case "Escape": {
					this.closeLightBox();
					return;
				}
				case "ArrowLeft": {
					this.previousImage();
					return;
				}
				case "ArrowRight": {
					this.nextImage();
					return;
				}
				default: {
					return;
				}
			}
		}
	}
}

	const galleryObject = new Gallery(
		imageRef,
		".js-gallery",
		"gallery__item",
		"gallery__link",
		"gallery__image",
		".js-lightbox",
		".js-lightbox .lightbox__image",
		".js-lightbox button[data-action='close-lightbox']",
	);
	galleryObject.galleryEl.addEventListener(
		"click",
		galleryObject.openLightBoxHandler.bind(galleryObject),
	);

