
import axios from 'axios';
import Notiflix from 'notiflix';



const searchForm = document.querySelector('#search-form');
const inputEl = document.querySelector('input');
const buttonEl = document.querySelector('button');
const gallery = document.querySelector(".gallery");
const pagination = document.querySelector(".load-more")

let currentPage = 1;
let pictureName = '';
const BASE_URL = 'https://pixabay.com/api/';
const API_Key = '36094465-f620b839f1404c2f0875ebba1';


async function fetchPixs(userInput, page = 1, perPage = 40) {
    const response = await axios.get(`${BASE_URL}?key=${API_Key}&q=${userInput}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`);
    return response.data;
}


pagination.setAttribute('hidden', "false")
pagination.addEventListener('click', onPagination);
searchForm.addEventListener("submit", onSearch);


async function onSearch(evt) {
  evt.preventDefault();
  pictureName = inputEl.value.trim();
    try {
    const data = await fetchPixs(pictureName);
            if (data.hits.length === 0) {
              Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
              gallery.innerHTML = '';
              pagination.setAttribute('hidden', "false");

            } else if (pictureName === '') {
              gallery.innerHTML = '';
              Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
              gallery.innerHTML = '';

            } else if (data.totalHits <= 40 ) {
              gallery.innerHTML = createMarkup(data.hits);
              pagination.setAttribute('hidden', "false");
              const message = document.createElement('p');
              message.textContent = "We're sorry, but you've reached the end of search results.";
              message.classList.add("gallery-message");
              gallery.insertAdjacentElement('beforeend', message);
              
            } else {
              gallery.innerHTML = createMarkup(data.hits);
              pagination.removeAttribute('hidden', "false");
              currentPage = 1;
            }
      } catch (err) {
    console.log(err);
  }
  searchForm.reset();
}

async function onPagination() {
  const loadPicture = pictureName;
  currentPage += 1;
  try {
    const data = await fetchPixs(loadPicture, currentPage);
    gallery.insertAdjacentHTML("beforeend", createMarkup(data.hits));

    if (data.hits.length === 0) {
        pagination.setAttribute('hidden', "false");
        
      } else if (data.totalHits <= gallery.children.length) {
        pagination.setAttribute('hidden', "false");
        const message = document.createElement('p');
        message.textContent = "We're sorry, but you've reached the end of search results.";
        message.classList.add("gallery-message")
        gallery.insertAdjacentElement('beforeend', message);
    } 
    } catch (err) {
    console.log(err);
  }
}


function createMarkup(arr) {
  return arr
    .map(
      ({webformatURL, tags, likes, views, comments, downloads }) => ` <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`).join("");
}



