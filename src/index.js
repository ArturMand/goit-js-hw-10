import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
const debounce = require('lodash.debounce');
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const DEBOUNCE_DELAY = 300;

const searchQuery = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchQuery.addEventListener(
  'input',
  debounce(renderSearchQuery, DEBOUNCE_DELAY)
);

function renderSearchQuery() {
  const searchQueryValue = searchQuery.value.trim();
  clearCountryRender();
  checkSearchQueryValue(searchQueryValue)
}
function clearCountryRender() {
  countryList.textContent = '';
  countryInfo.textContent = '';
}
function checkSearchQueryValue(searchQueryValue) {
    if (searchQueryValue !== '') {
        fetchCountries(searchQueryValue).then(resolve => {
          checkResolveValue(resolve);
          renderMarkupAfterCheck(resolve);
        });
      }
}
function checkResolveValue(resolveData) {
  if (resolveData.length > 10) {
    return Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
  if (resolveData.length === 0) {
    return Notify.failure('Oops, there is no country with that name');
  }
}
function renderMarkupAfterCheck(resolve) {
  if (resolve.length >= 2 && resolve.length <= 10) {
    return renderCountryList(resolve);
  }
  if (resolve.length === 1) {
    return renderOneCountry(resolve);
  }
}
function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li>
        <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="30" hight="20">
           <b>${country.name.official}</p>
                  </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}
function renderOneCountry(countries) {
  const markup = countries
    .map(country => {
      return `<li>
        <img src="${country.flags.svg}" alt="Flag of ${
        country.name.official
      }" width="30" hight="20">
           <b>${country.name.official}</b></p>
              <p><b>Capital</b>: ${country.capital}</p>
              <p><b>Population</b>: ${country.population}</p>
              <p><b>Languages</b>: ${Object.values(country.languages)} </p>
                  </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}
