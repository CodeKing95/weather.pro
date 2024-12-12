const API_BASE_URL = "http://api.weatherapi.com/v1";
const API_KEY = "505082cbb0ed453482d163906240212";
const FAVORITE_CITIES_KEY = "favorite-cities";

export async function getForecastWeather(location, days = 3) {
  const response = await fetch(
    `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=id:${location}&lang=en&days=${days}`
  );

  const weatherData = await response.json();

  console.log(weatherData);

  return weatherData;
}

export async function searchLocation(q) {
  const response = await fetch(
    `${API_BASE_URL}/search.json?key=${API_KEY}&q=${q}&lang=en`
  );
  const searchResults = await response.json();

  return searchResults;
}

export function getFavoriteCities() {
  return JSON.parse(localStorage.getItem(FAVORITE_CITIES_KEY)) || [];
}
export function saveCityAsFavorite(city) {
  const favorites = getFavoriteCities();
  if (favorites.find((favorite) => favorite === city)) {
    alert(city + " Already Selected!");
    return;
  }
  favorites.push(city);
  localStorage.setItem(FAVORITE_CITIES_KEY, JSON.stringify(favorites));
}

export function removeCityFromFavorites(city) {
  const favorites = getFavoriteCities();

  const filteredFavorites = favorites.filter((favorite) => favorite !== city);

  localStorage.setItem(FAVORITE_CITIES_KEY, JSON.stringify(filteredFavorites));
}
