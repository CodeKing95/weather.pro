import { loadDetailView } from "./detailView";
import { rootElement } from "./main";
import { renderLoadingScreen } from "./loading";
import {
  getFavoriteCities,
  getForecastWeather,
  removeCityFromFavorites,
  searchLocation,
} from "./api";
import { getConditionImagePath } from "./conditions";
import { formatTemperature } from "./utils";

export async function loadMainMenu() {
  rootElement.classList.remove("show-background");
  renderLoadingScreen("Loading...");
  await renderMainMenu();
}

async function renderMainMenu() {
  rootElement.innerHTML = `
    <div class="main-menu">
    ${getMenuHeaderHtml()}
    ${await getCityListHtml()}
    </div>

 `;
  registerEventListeners();
}

function getMenuHeaderHtml() {
  return `
    
        <div class="main-menu__heading">
          Weather<button class="main-menu__edit">Edit</button>
        </div>
        <div class="main-menu__search-bar">
          <input
            type="text"
            class="main-menu__search-input"
            placeholder="Search City..."
          />  
          <div class="main-menu__search-results"></div>
        </div>
    
    `;
}

const removeIcon = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
`;

async function getCityListHtml() {
  const favoriteCities = getFavoriteCities();

  if (!favoriteCities || favoriteCities.length < 1) {
    return "Not Saved a Favorite City.";
  }

  const favoriteCityElements = [];

  for (let city of favoriteCities) {
    const weatherData = await getForecastWeather(city, 1);

    const { location, current, forecast } = weatherData;
    const currentDay = forecast.forecastday[0];

    const conditionImage = getConditionImagePath(
      current.condition.code,
      current.is_day !== 1
    );

    const cityHtml = `
    <div class="city-wrapper">
      <div class="city-wrapper__remove" data-city-id="${city}">${removeIcon}</div>
            <div
              class="city"
              data-city-name="${location.name}"
              data-city-id="${city}"
              ${
                conditionImage
                  ? `style="
                 --condition-image: url(${conditionImage});
                 "`
                  : ""
              }
              
            >
              <div class="city__left-column">
                <h2 class="city__name">${location.name}</h2>
                <div class="city__country">${location.country}</div>
                <div class="city__condition">${current.condition.text}</div>
              </div>
              <div class="city__right-column">
                <div class="city__temperature">${formatTemperature(
                  current.temp_c
                )}°</div>
                <div class="city__min-max-temperature">H:${formatTemperature(
                  currentDay.day.maxtemp_c
                )}° T:5${formatTemperature(currentDay.day.mintemp_c)}°</div>
              </div>
            </div>
          </div>
    
    `;

    favoriteCityElements.push(cityHtml);
  }

  const favoriteCitiesHtml = favoriteCityElements.join("");
  return `
     
        <div class="main-menu__cities-list">
          ${favoriteCitiesHtml}
        </div>
      
    `;
}
function renderSearchResults(searchResults) {
  const searchResultsElements = searchResults.map(
    (result) => `
    <div class="search-result" data-city-name="${result.name}" data-city-id="${result.id}">
      <h3 class="search-result__name">${result.name}</h3>
      <p class="search-result__country">${result.country}</p> 
    </div>
    `
  );

  const searchResultsHtml = searchResultsElements.join("");

  const searchResultsDiv = document.querySelector(".main-menu__search-results");
  searchResultsDiv.innerHTML = searchResultsHtml;
}

function registerSearchResultsEventListeners() {
  const searchResults = document.querySelectorAll(".search-result");

  searchResults.forEach((searchResults) => {
    searchResults.addEventListener("click", () => {
      const cityName = searchResults.getAttribute("data-city-name");
      const cityId = searchResults.getAttribute("data-city-id");
      loadDetailView(cityName, cityId);
    });
  });
}

function bodyClickHandler(e) {
  const searchwrapper = document.querySelector(".main-menu__search-bar");

  if (!searchwrapper) {
    document.removeEventListener("click", bodyClickHandler);
    return;
  }

  if (!searchwrapper.contains(e.target)) {
    const searchResults = document.querySelector(".main-menu__search-results");
    searchResults.classList.add("main-menu__search-results--hidden");
  }
}

function registerEventListeners() {
  const editButton = document.querySelector(".main-menu__edit");
  const removeButtons = document.querySelectorAll(".city-wrapper__remove");

  removeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      removeCityFromFavorites(btn.getAttribute("data-city-id"));
      btn.parentElement.remove();
    });
  });

  editButton.addEventListener("click", () => {
    const EDIT_ATTRIBUTE = "data-edit-mode";

    if (!editButton.getAttribute(EDIT_ATTRIBUTE)) {
      editButton.setAttribute(EDIT_ATTRIBUTE, "true");
      editButton.textContent = "done";
      removeButtons.forEach((btn) => {
        btn.classList.add("city-wrapper__remove--show");
      });
    } else {
      editButton.removeAttribute(EDIT_ATTRIBUTE);
      editButton.textContent = "edit";

      removeButtons.forEach((btn) => {
        btn.classList.remove("city-wrapper__remove--show");
      });
    }
  });

  const searchBar = document.querySelector(".main-menu__search-input");

  searchBar.addEventListener("input", async (e) => {
    const q = e.target.value;

    let searchResults = [];

    if (q.length > 1) {
      searchResults = await searchLocation(q);
      console.log(searchResults);
    }

    renderSearchResults(searchResults);
    registerSearchResultsEventListeners();
  });

  document.addEventListener("click", bodyClickHandler);

  searchBar.addEventListener("focusin", () => {
    const searchResults = document.querySelector(".main-menu__search-results");
    searchResults.classList.add("main-menu__search-results--hidden");
  });

  const cities = document.querySelectorAll(".city");

  cities.forEach((city) => {
    city.addEventListener("click", () => {
      const cityName = city.getAttribute("data-city-name");
      const cityId = city.getAttribute("data-city-id");
      loadDetailView(cityName, cityId);
    });
  });
}
