// Imports block
import data from './data.js';
import refs from './refs.js';

// ======= creating of markup and modal "open" and "close" actions  =======

// destructurizes array for quick access to variables
const { galleryContainer, modal, closeModalBtn, modalContentImg } = refs;

// creates markup string from data array
function createItems(array) {
	return array
		.map((arrayElement) => {
			const { preview, original, description } = arrayElement;

			return `
            <li class="gallery__item">
               <div class="gallery__link">
                  <img class="gallery__image" src="${preview}" alt="${description}" data-fullimage="${original}">
               </div>
            </li>
            `;
		})
		.join('');
}

const galleryItems = createItems(data);

// inserts markup in DOM
galleryContainer.insertAdjacentHTML('afterbegin', galleryItems);

// declares open image functon
function openImage(element) {
	element.classList.add(`is-open`);
}

// declares close image function
function closeImage(element) {
	element.classList.remove(`is-open`);
}

// declares setter function for the modal image
function setImageSrcAlt(src, alt) {
	modalContentImg.src = src;
	modalContentImg.alt = alt;
}

// inserts the "hi-res image" src attribute of opened thumbnail item
galleryContainer.addEventListener(`click`, (e) => {
	if (e.target.nodeName === `IMG`) {
		openImage(modal);
		setImageSrcAlt(e.target.dataset.fullimage, e.target.alt); // inserts image src and alt attributes in the DOM
	}
});

// creates event listener that accepts CloseModalByClick callback function
modal.addEventListener(`click`, closeModalByClick);

function closeModalByClick(e) {
	if (
		e.target.classList.contains(`lightbox__overlay`) ||
		e.target.nodeName === `BUTTON`
	) {
		closeImage(modal);
		setImageSrcAlt('', ''); // resets img and src attributes to empty string to avoid first load of previously opened image;
	}
}

// creates event listener that accepts CloseModalByKey callback function
window.addEventListener(`keydown`, closeModalByKey);

function closeModalByKey(e) {
	if (e.code === `Escape` && modal.classList.contains(`is-open`)) {
		closeImage(modal);
	}
}

// assignment of event listener to closeModalBtn
closeModalBtn.addEventListener(`click`, closeModalByClick);

// removes event listeners from modal and window when the modal window is closed
if (modal.classList.contains(`is-open`)) {
	window.removeEventListener(`keydown`, closeModalByKey);
	modal.removeEventListener(`click`, closeModalByClick);
}

// ======= arrow navigation =======

// creates array of links for hi-res images
const imagesArray = data.map((element) => {
	return element.original;
});

// assignment of event listeners to ArrowLeft and ArrowRight
window.addEventListener(`keydown`, (e) => {
	let currentImageIndex;

	if (e.code === `ArrowRight` && modal.classList.contains(`is-open`)) {
		currentImageIndex = imagesArray.indexOf(modalContentImg.src);
		modalContentImg.src = imagesArray[currentImageIndex + 1];

		// checks if the current image from an array is the first available one and on ArrowLeft click restarts the order from the end of the array
		if (currentImageIndex === imagesArray.length - 1) {
			currentImageIndex = 0;
			modalContentImg.src = imagesArray[currentImageIndex];
		}
	} else if (e.code === `ArrowLeft` && modal.classList.contains(`is-open`)) {
		currentImageIndex = imagesArray.indexOf(modalContentImg.src);
		modalContentImg.src = imagesArray[currentImageIndex - 1];

		// checks if the current image from an array is actually the last available one and resets the order for the next image on ArrowRight click to start it from the very beginning
		if (currentImageIndex === 0) {
			currentImageIndex = imagesArray.length - 1;
			modalContentImg.src = imagesArray[currentImageIndex];
		}
	}
});
