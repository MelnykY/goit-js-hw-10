import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener(`input`, debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
  event.preventDefault();
  const boxValue = refs.searchBox.value;
  const searchBoxValue = boxValue.trim();
  if (searchBoxValue === '') {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
  }

  fetchCountries(searchBoxValue)
    .then(renderCountry)
    .catch(err => {
      Notify.failure('Oops, there is no country with that name');
    });
}

function countryСard({ flags, name, capital, population, languages }) {
  return `
      <div class="country-info__container">
        <div class="country-info__box">
          <img class="country-info__flag" src="${flags.svg}" alt="${
    name.official
  }" width="50" />
          <h2 class="country-info__name">${name.official}</h2>
        </div>
        <p class="country-info__capital"><span class="country-info__weight">Capital:</span> ${capital}</p>
        <p class="country-info__population"><span class="country-info__weight">Population:</span> ${population}</p>
        <p class="country-info__languages"><span class="country-info__weight">Languages:</span> ${Object.values(
          languages
        )}</p>
      </div>
    `;
}

function countryList({ flags, name }) {
  return `
    <li class="country-list__item">
      <img class="country-list__flag" src="${flags.svg}" alt="${name.official}" width="25" />
      <h2 class="country-list__name">${name.official}</h2>
    </li>
    `;
}

function renderCountry(countries) {
  if (countries.length >= 1 && countries.length < 10) {
    const markup = countries.map(country => countryList(country));
    refs.countryInfo.innerHTML = markup.join('');
    refs.countryList.innerHTML = '';
  }
  if (countries.length === 1) {
    const markup = countries.map(country => countryСard(country));
    refs.countryInfo.innerHTML = markup.join('');
    refs.countryList.innerHTML = '';
  }
  if (countries.length >= 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
}
//ERROR - 404
//clear list if input name if junk