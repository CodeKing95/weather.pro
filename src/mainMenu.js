import { loadDetailView } from "./detailView";
import { rootElement } from "./main";
import { renderLoadingScreen } from "./loading";
import { getForecastWeather } from "./api";
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
    
        <div class="main-menu_heading">
          Weather<button class="main-menu_edit">Bearbeiten</button>
        </div>
        <div class="main-menu_search-bar">
          <input
            type="text"
            class="main-menu_search-input"
            placeholder="Search City..."
          />
        </div>
    
    `;
}

async function getCityListHtml() {
  const belovedCities = ["Bejing", "Toronto", "Cape Town"];

  const belovedCityElements = [];

  for (let city of belovedCities) {
    const weatherData = await getForecastWeather(city, 1);

    const { location, current, forecast } = weatherData;
    const currentDay = forecast.forecastday[0];

    const conditionImage = getConditionImagePath(
      current.condition.code,
      current.is_day !== 1
    );

    const cityHtml = `
    <div class="city-wrapper">
            <div
              class="city"
              data-city-name="${city}"
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

    belovedCityElements.push(cityHtml);
  }

  const belovedCitiesHtml = belovedCityElements.join("");
  return `
     
        <div class="main-menu__cities-list">
          ${belovedCitiesHtml}
        </div>
      
    `;
}

function registerEventListeners() {
  const cities = document.querySelectorAll(".city");

  cities.forEach((city) => {
    city.addEventListener("click", () => {
      const cityName = city.getAttribute("data-city-name");
      loadDetailView(cityName);
    });
  });
}
