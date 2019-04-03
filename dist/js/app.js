// ------------------------ CLASS --------------------------------
// ----- class - current weather api -----
class AjaxWeather {
  constructor() {
    this.apiKey = "933d0aa01d2e2875d009ccb7ff6cc74c";
  }
  async getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${
      this.apiKey
    }&units=imperial`;
    const currentWeather = await fetch(url);
    const weatherJson = await currentWeather.json();
    return weatherJson;
  }
}

// -----class - current LOCATION weather api -----
class AjaxLocationWeather {
  constructor() {
    this.apiKey = "933d0aa01d2e2875d009ccb7ff6cc74c";
  }

  async getLocationWeather(latitude, longitude) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${
      this.apiKey
    }&units=imperial`;
    const locationWeather = await fetch(url);
    const locationWeatherJson = await locationWeather.json();
    return locationWeatherJson;
  }
}

// -----class - display weather information -----
class displayTemperatureInfo {
  constructor() {
    this.city_title = document.querySelector(".city-title");
    this.city_temperature = document.querySelector(".city-temperature");
    this.city_description = document.querySelector(".city-description");
    this.city_icon = document.querySelector(".city-icon");
    this.city_humidity = document.querySelector(".city-humidity");
    this.city_wind = document.querySelector(".wind");
    this.city_sunrise = document.querySelector(".sunrise");
    this.city_sunset = document.querySelector(".sunset");
  }

  showInfo(data) {
    const {
      name,
      main: { temp, humidity },
      wind: { speed },
      sys: { sunrise, sunset }
    } = data;
    const { description, icon } = data.weather[0];
    const sunrise_time = new Date(sunrise * 1000);
    const sunset_time = new Date(sunset * 1000);
    const sunrise_hour = sunrise_time.getHours();
    const sunrise_minutes = sunrise_time.getMinutes();
    const sunset_hour = sunset_time.getHours();
    const sunset_minutes = sunset_time.getMinutes();

    this.city_title.textContent = name;
    this.city_temperature.innerHTML = `${Math.round(
      temp
    )}&#186;F / ${Math.round((Math.round(temp) - 32) * (5 / 9) * 10) /
      10}&#186;C`;
    this.city_description.textContent = description;
    this.city_icon.src = `http://openweathermap.org/img/w/${icon}.png`;
    this.city_humidity.textContent = `Humidity: ${humidity}`;
    this.city_wind.textContent = `Wind: ${Math.round(speed)} mph`;

    if (sunrise_hour < 10 && sunrise_minutes < 10) {
      this.city_sunrise.textContent = `Sunrise: 0${sunrise_hour}:0${sunrise_minutes}`;
    } else if (sunrise_hour < 10) {
      this.city_sunrise.textContent = `Sunrise: 0${sunrise_hour}:${sunrise_minutes}`;
    } else if (sunrise_minutes < 10) {
      this.city_sunrise.textContent = `Sunrise: ${sunrise_hour}:0${sunrise_minutes}`;
    } else {
      this.city_sunrise.textContent = `Sunrise: ${sunrise_hour}:${sunrise_minutes}`;
    }

    if (sunset_hour < 10 && sunset_minutes < 10) {
      this.city_sunset.textContent = `Sunset: 0${sunset_hour}:0${sunset_minutes}`;
    } else if (sunset_hour < 10) {
      this.city_sunset.textContent = `Sunset: 0${sunset_hour}:${sunset_minutes}`;
    } else if (sunset_minutes < 10) {
      this.city_sunset.textContent = `Sunset: ${sunset_hour}:0${sunset_minutes}`;
    } else {
      this.city_sunset.textContent = `Sunset: ${sunset_hour}:${sunset_minutes}`;
    }
  }
}

// ------------------------------------------------------------------------------------------
// ----- Global variables -----
const search_form = document.querySelector("#search-form");
const search_input = document.querySelector(".search-input");
const open_btn = document.querySelector(".open-btn");
const weather_div = document.querySelector("#weather");
let city_input_value = "";

// ----- Upon window load, display the current location weather data
window.addEventListener("load", () => {
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;

        currentLocationAjax = new AjaxLocationWeather();
        currentLocationAjax.getLocationWeather(latitude, longitude);
        const display = new displayTemperatureInfo();

        // display city temp
        currentLocationAjax
          .getLocationWeather(latitude, longitude)
          .then(data => {
            if (data.message == "city not found") {
              cityNotFound(data);
            } else {
              // adjust the thermometer upon search
              let temp = data.main.temp;
              gauge(temp);

              // display the datas after 0.8s
              setTimeout(() => display.showInfo(data), 800);
              search_input.value = "";
            }
          });
      });
    } else {
      console.log("geolocation is not supported by this browser");
      alert("geolocation is not supported by this browser");
      return; // exit out of the function
    }
  };
  getLocation();
});

// ----- show search input when search button clicked
open_btn.addEventListener("click", event => {
  event.preventDefault();
  showSearchInput();
});

// ----- when pressed ENTER key to search to submit -----
search_input.addEventListener("keyup", event => {
  event.preventDefault();
  // instantiate the class
  const ajax = new AjaxWeather();
  const display = new displayTemperatureInfo();
  if (event.keyCode === 13) {
    if (search_input.value.length == 0) {
      cityNotFound();
      return; // exit out of the function
    } else {
      city_input_value = search_input.value.toLowerCase();
      // display city temp
      ajax.getWeather(city_input_value).then(data => {
        if (data.message == "city not found") {
          cityNotFound(data);
        } else {
          // hideSearchInput();

          // adjust the thermometer upon search
          let temperature = data.main.temp;
          gauge(temperature);

          // display the datas after 0.8s
          setTimeout(() => display.showInfo(data), 800);
          search_input.value = "";
        }
      });
    }
  }
});

// ----- when search button is clicked to submit -----
search_form.addEventListener("submit", event => {
  event.preventDefault();

  // instantiate the class
  const ajax = new AjaxWeather();
  const display = new displayTemperatureInfo();

  if (search_input.value.length == 0) {
    cityNotFound();
    return; // exit out of the function
  } else {
    city_input_value = search_input.value.toLowerCase();
    // display city temp
    ajax.getWeather(city_input_value).then(data => {
      if (data.message == "city not found") {
        cityNotFound(data);
      } else {
        // hideSearchInput();

        // adjust the thermometer upon search
        let temp = data.main.temp;
        gauge(temp);

        // display the datas after 0.8s
        setTimeout(() => display.showInfo(data), 800);
        search_input.value = "";
      }
    });
  }

  // Hide mobile soft keyboard upon submit
  search_input.blur();
});

function gauge(temp) {
  let fahren = document.querySelector(".filler-1");
  let cel = document.querySelector(".filler-2");
  let f_arrow = document.querySelector(".arr1");
  let c_arrow = document.querySelector(".arr2");
  let circle1 = document.querySelector(".c1");
  let circle2 = document.querySelector(".c2");
  let odometer_1 = document.querySelector(".odo1");
  let odometer_2 = document.querySelector(".odo2");
  let f_temp = Math.round(temp);
  let c_temp = Math.round((Math.round(temp) - 32) * (5 / 9) * 10) / 10;
  // weather temperature color scale
  let blue = "#7ed6df";
  let lightBlue = "#dff9fb";
  let lightIce = "#c7ecee";
  let green = "#32ff7e";
  let orange = "#fd9644";
  let blue_2 = "#f9ca24";
  let red = "#eb4d4b";

  if (temp > 90) {
    fahren.style.background = red;
    cel.style.background = red;
    circle1.style.background = red;
    circle2.style.background = red;
  } else if (temp > 80) {
    fahren.style.background = orange;
    cel.style.background = orange;
    circle1.style.background = orange;
    circle2.style.background = orange;
  } else if (temp > 70) {
    fahren.style.background = blue_2;
    cel.style.background = blue_2;
    circle1.style.background = blue_2;
    circle2.style.background = blue_2;
  } else if (temp > 60) {
    fahren.style.background = green;
    cel.style.background = green;
    circle1.style.background = green;
    circle2.style.background = green;
  } else if (temp > 45) {
    fahren.style.background = blue;
    cel.style.background = blue;
    circle1.style.background = blue;
    circle2.style.background = blue;
  } else if (temp > 35) {
    fahren.style.background = lightIce;
    cel.style.background = lightIce;
    circle1.style.background = lightIce;
    circle2.style.background = lightIce;
  } else {
    fahren.style.background = lightBlue;
    cel.style.background = lightBlue;
    circle1.style.background = lightBlue;
    circle2.style.background = lightBlue;
  }

  // let fahren = document.querySelector(".filler-1");
  let f_height = `${120 + 4 * f_temp}`;
  fahren.style.height = `${f_height}px`;

  // let cel = document.querySelector(".filler-2");
  let c_height = `${280 + 6 * c_temp}`;
  cel.style.height = `${c_height}px`;

  // let f_arrow = document.querySelector(".arr1");
  f_arrow.style.top = `-${f_height}px`;
  odometer_2.innerHTML = c_temp;

  // let c_arrow = document.querySelector(".arr2");
  c_arrow.style.top = `-${c_height}px`;
  odometer_1.innerHTML = f_temp;
}

function showSearchInput() {
  search_input.classList.add("show-search-input");
  open_btn.style.display = "none";
}

function hideSearchInput() {
  search_input.classList.remove("show-search-input");
  // setTimeout(() => {
  //   search_input.value = "";
  //   open_btn.style.display = "block";
  // }, 350);
}

function cityNotFound(data) {
  if (!data) {
    search_input.value = "";
    search_input.classList.add("red");
  } else {
    search_input.value = "";
    search_input.classList.add("red");
    search_input.placeholder = data.message;
  }
  setTimeout(() => {
    search_input.classList.remove("red");
    search_input.placeholder = "search city";
  }, 1000);
}
