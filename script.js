 // DOM Elements
 const searchInput = document.getElementById("search-input");
 const searchButton = document.getElementById("search-button");
 const cityName = document.getElementById("city-name");
 const dateElement = document.getElementById("date");
 const temperature = document.getElementById("temperature");
 const weatherDescription = document.getElementById("weather-description");
 const weatherIcon = document.getElementById("weather-icon");
 const windSpeed = document.getElementById("wind-speed");
 const humidity = document.getElementById("humidity");
 const precipitation = document.getElementById("precipitation");
 const forecastContainer = document.getElementById("forecast-container");
 // API Configuration
 const apiKey = '0f4067b5a3555cbf68859423ebddfd2c';
 const baseUrl = 'https://api.openweathermap.org/data/2.5';

 function getWeatherIcon(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
function currentDate(timestamp){
  const date = timestamp ? new Date(timestamp * 1000) : new Date(); 
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let day = days[date.getDay()];
  let month = months[date.getMonth()];
  let year = date.getFullYear();
  let fullDate = `${day}, ${month} - ${year}`;
  return fullDate;
}

function updateForecast(data) {
  forecastContainer.innerHTML = '';

  for (let i = 0; i < data.list.length; i += 8) {
    const day = data.list[i];
    const dayElement = document.createElement('div');
    dayElement.className = 'forecast-day';

    const formattedDate = currentDate(day.dt); 

    dayElement.innerHTML = `
      <div>${formattedDate}</div>
      <img src="${getWeatherIcon(day.weather[0].icon)}" class="forecast-icon">
      <div>${Math.round(day.main.temp_max)}°/${Math.round(day.main.temp_min)}°</div>
      <div>${day.weather[0].main}</div>
    `;
    forecastContainer.appendChild(dayElement);
  }
}


 async function getCurrentWeather(city) {
  try {
    const currentResponse = await fetch(`${baseUrl}/weather?q=${city}&units=metric&appid=${apiKey}`);
    var data = await currentResponse.json();
    console.log("Current Weather Data:", data);
    console.log(data);
    

    if(!currentResponse.ok){
      throw new Error("unable to get data");
    }
    else{
      cityName.innerHTML = city;
      temperature.innerHTML = Math.floor(data.main.temp)+" °";
      weatherDescription.innerHTML = data.weather[0].description;
      windSpeed.innerHTML = data.wind.speed;
      dateElement.innerHTML = currentDate();
      humidity.innerHTML = data.main.humidity;
      weatherIcon.src = getWeatherIcon(data.weather[0].icon);
      if (data.rain && data.rain["1h"]) {
        precipitation.innerHTML = `Rain: ${data.rain["1h"]} mm (last hour)`;
      } else if (data.snow && data.snow["1h"]) {
        precipitation.innerHTML = `Snow: ${data.snow["1h"]} mm (last hour)`;
      } else {
        precipitation.innerHTML = "No precipitation reported.";
      }
    }  

  } catch (error) {
    alert("Error fetching weather data. Please try again.");
    console.error(error);
  }
 }

 async function getForecastWeather(city) {
  try {
    const forecastResponse = await fetch(`${baseUrl}/forecast?q=${city}&units=metric&appid=${apiKey}`);
    const forecastData = await forecastResponse.json();
    
    if(!forecastResponse.ok) {
      throw new Error("Unable to get forecast data");
    }
    
    updateForecast(forecastData);
  } catch(error) {
    console.error("Error fetching forecast:", error);
  }
}

searchButton.addEventListener("click", ()=>{
  let searchInputValue = searchInput.value;
  getCurrentWeather(searchInputValue);
  getForecastWeather(searchInputValue);  
  searchInput.value = "";
});

getCurrentWeather("Mandaluyong");
getForecastWeather("Mandaluyong");