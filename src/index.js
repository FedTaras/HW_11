import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const axios = require('axios');

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34843730-197a34e2a316a24279cec26df';

let page = 1;
let searchValue = '';

searchForm.addEventListener('submit', loadPhoto);
loadMoreBtn.addEventListener('click', loadMorePhoto);

loadMoreBtn.hidden = true;

function loadPhoto(e) {
  e.preventDefault();

  gallery.innerHTML = '';
  if (searchValue !== e.currentTarget.elements.searchQuery.value) {
    loadMoreBtn.hidden = true;

    page = 1;
    searchValue = e.currentTarget.elements.searchQuery.value;
  }

  getImage(searchValue);
}

async function loadMorePhoto(e) {
  e.preventDefault();
  page += 1;

  try {
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&safesearch=true&orientation=horizontal&per_page=40&page=${page}&image_type=photo&q=${searchValue}`
    );
    const arr = response.data.hits;
    console.log(arr.length);

    gallery.insertAdjacentHTML('beforeend', createMarkap(arr));
    if (arr.length < 40) {
      Notiflix.Notify.info(
        `We're sorry, but you've reached the end of search results.`
      );
      loadMoreBtn.hidden = true;
      return;
    }

    slider();
  } catch (error) {
    console.error(error);
  }
}

async function getImage(searchValue) {
  try {
    const response = await axios(
      `${BASE_URL}?key=${API_KEY}&safesearch=true&orientation=horizontal&per_page=40&page=${page}&image_type=photo&q=${searchValue}`
    );

    if (!response.data.total || !searchValue) {
      loadMoreBtn.hidden = true;
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      return;
    }
    const arr = response.data.hits;

    gallery.insertAdjacentHTML('beforeend', createMarkap(arr));
    slider();

    Notiflix.Notify.success(`Hooray! We found ${response.data.total} images.`);

    if (arr.length < 40) {
      Notiflix.Notify.info(
        `We're sorry, but you've reached the end of search results.`
      );
      return;
    }

    loadMoreBtn.style.display = 'flex';
    loadMoreBtn.hidden = false;
  } catch (error) {
    console.error(error);
  }
}

function createMarkap(arr) {
  return arr
    .map(
      ({
        downloads,
        comments,
        views,
        likes,
        tags,
        webformatURL,
        largeImageURL,
      }) =>
        `
  <div class="photo-card">
        <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
        <div class="info">
          <p class="info-item">
            <b>Likes: ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views: ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments: ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads: ${downloads}</b>
          </p>
        </div>
      </div>`
    )
    .join('');
}

function slider() {
  let galleryBig = new SimpleLightbox('.gallery a');
  galleryBig.on('show.simplelightbox');
}
