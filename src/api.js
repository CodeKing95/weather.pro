const API_BASE_URL = "http://api.weatherapi.com/v1";
const API_KEY = "505082cbb0ed453482d163906240212";

export async function getForecastWeather(location, days = 3) {
  const response = await fetch(
    `${API_BASE_URL}/forecast.json?key=${API_KEY}&q=${location}&lang=de&days=${days}`
  );

  const weatherData = await response.json();

  console.log(weatherData);

  return weatherData;
}
