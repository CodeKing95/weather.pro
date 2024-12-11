export function formatTemperature(temperature) {
  return Math.floor(temperature);
}

export function formatHourlyTime(time) {}

export function get24HoursForecastFromNow(forecast, lastUpdatedEpoch) {
  const todayForecast = forecast[0].hour;
  const tomorrowForecast = forecast[1].hour;

  const newForecast = [];

  const firstFutureTimeIndex = todayForecast.findIndex(
    (hour) => hour.time_epoch > lastUpdatedEpoch
  );

  for (let i = firstFutureTimeIndex - 1; i < todayForecast.length; i++) {
    newForecast.push(todayForecast[i]);
  }

  let tomorrowIndex = 0;

  while (newForecast.length < 24) {
    newForecast.push(tomorrowForecast[tomorrowIndex]);
    tomorrowIndex++;
  }

  return newForecast;
}

export function getDayOfWeek(date) {
  const dateObj = new Date(date);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[dateObj.getDay()];
}

export function formatToMilitaryTime(time) {
  const isAM = time.includes("AM");

  const timeWithoutSuffix = time.split(" ")[0];

  if (isAM) {
    return timeWithoutSuffix;
  }

  const [hour, minutes] = timeWithoutSuffix.split(":");

  const newHour = Number(hour) + 12;

  return newHour + ":" + minutes;
}
