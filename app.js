// WeatherApp Constructor Function
function WeatherApp(apiKey) {

    this.apiKey = apiKey;

    this.cityInput = document.getElementById("cityInput");
    this.searchBtn = document.getElementById("searchBtn");

    this.currentWeather = document.getElementById("currentWeather");
    this.forecastContainer = document.getElementById("forecastContainer");

    // Event Listener
    this.searchBtn.addEventListener("click", this.getWeather.bind(this));
}


// Fetch Weather Data using Promise.all()
WeatherApp.prototype.getWeather = function () {

    const city = this.cityInput.value.trim();

    if (!city) {
        alert("Please enter a city name");
        return;
    }

    const currentURL =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`;

    const forecastURL =
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`;

    Promise.all([
        fetch(currentURL).then(res => res.json()),
        fetch(forecastURL).then(res => res.json())
    ])
        .then(data => {

            const currentData = data[0];
            const forecastData = data[1];

            this.displayCurrentWeather(currentData);
            this.displayForecast(forecastData);

        })
        .catch(error => {
            console.error("Error fetching weather:", error);
        });
};



// Display Current Weather
WeatherApp.prototype.displayCurrentWeather = function (data) {

    if (data.cod !== 200) {
        this.currentWeather.innerHTML = "City not found";
        return;
    }

    const html = `
        <h3>${data.name}</h3>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
    `;

    this.currentWeather.innerHTML = html;
};



// Display 5 Day Forecast
WeatherApp.prototype.displayForecast = function (data) {

    this.forecastContainer.innerHTML = "";

    // Filter forecast to once per day (12:00)
    const dailyForecast = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    dailyForecast.slice(0, 5).forEach(day => {

        const date = new Date(day.dt_txt).toDateString();

        const card = `
            <div style="
                border:1px solid #ccc;
                padding:10px;
                margin:10px;
                display:inline-block;
                width:140px;
                text-align:center;
            ">
                <p><b>${date}</b></p>
                <p>${day.main.temp} °C</p>
                <p>${day.weather[0].description}</p>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
            </div>
        `;

        this.forecastContainer.innerHTML += card;
    });
};



// Initialize the App
const app = new WeatherApp("39e8b3510f18095aaba53edaf2663c73");