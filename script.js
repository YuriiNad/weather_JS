//main data;
const mainData = { // main information to get city weather object;
    url: "http://api.openweathermap.org/data/2.5/",
    appId: "8c11b9f0aba5f87af6fee00297f1a0f2"
};

const listOfCities = { // Object constituting "list of cities". You can add aditional cities if you want!;
    702550: "Lviv",
    703448: "Kyiv",
    707471: "Ivano-Frankivsk",
    2831493: "Solnhofen"
};

//styles of maps;
let mapStyles = [
    {
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "landscape",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {}
];

//variables for weather data;
let mainCityName = document.querySelector(".cityName");
let countryIndex = document.querySelector(".countryIndex");
let mainCityTemperature = document.querySelector(".cityTemperature");
let mainCityWeatherIcon = document.querySelector(".cityWeatherIcon");
let additCityPressure = document.querySelector(".cityPressure");
let additCityFeelsLike = document.querySelector(".cityFeelsLike");
let additCityWeatherDIscription = document.querySelector(".cityWeatherDIscription");
let additCityHumidity = document.querySelector(".cityHumidity");


// function that creates "select list";
function listOfcities() { //creates LIST OF CITIES;
    let selectElements = document.querySelector("#cityId"); // Container that will contain future "Names of Cities";

    for (const key in listOfCities) {
        let newOptionItem = document.createElement("option"); // cteates new "OPTION" element into current "SELECT";
        newOptionItem.innerHTML = listOfCities[key]; //applies "city name" to gotten "OPTION";
        selectElements.append(newOptionItem); // adds CREATED "OPTION" element to current "SELECT";
        newOptionItem.setAttribute("value", `${key}`); // cteates a new attribute to this new "OPTION";
    }
    getWeatherDate(); // calling this function here to prevent "EMPTY" data;
};
listOfcities();

// function that requests information;
function getWeatherDate() { //gets WEATHER INFORMATION according to selected city;
    const cityId = document.querySelector('#cityId').value;
    fetch(`${mainData.url}weather?id=${cityId}&units=metric&APPID=${mainData.appId}`)
        .then(weather => {
            return weather.json();
        })
        .then(showAllWeatherData);
};

// function that gets all weather information;
function showAllWeatherData(data) {
    console.log(data); // to check MAIN data
   
    // All weather data;
    let cityWeatherIcon = `<img src='https://openweathermap.org/img/wn/${data.weather[0]["icon"]}@2x.png'>`; // gets city weather img;
    let cityMapTemperature = Math.round(data.main["temp"]) + " &degC"; // gets city temperature;
    let cityName = data.name;
    let cityPresure = data.main["pressure"];
    let cityFeelsLike = data.main["feels_like"];
    let cityWeatherDescription = data.weather[0]["description"];
    let cityHumidity = data.main["humidity"];
    let cityCountryIndex = data.sys["country"];

    // Assigning weather data;
    mainCityName.textContent = cityName; // asigns name of current city;
    mainCityTemperature.innerHTML = cityMapTemperature; // asigns temperature of city;
    mainCityWeatherIcon.innerHTML = cityWeatherIcon; // asigns weather img;
    additCityPressure.textContent = `Pressure: ${cityPresure} hPa.`; // asigns presure;
    additCityFeelsLike.innerHTML = `Feels like: ${Math.round(cityFeelsLike)} &degC.`; // asigns weather "feels like";
    additCityWeatherDIscription.textContent = cityWeatherDescription.charAt(0).toUpperCase() + cityWeatherDescription.slice(1) + '.'; // asigns weather description;
    additCityHumidity.innerHTML = `Humidity: ${cityHumidity} &#37.`; // asigns Humidity;
    countryIndex.textContent = cityCountryIndex;

    // all the belongth to MAP (below);
    let mapContainer = document.querySelector(".cityMapContainer");
    let cityCoordinateLon = data.coord["lon"];
    let cityCoordinateLat = data.coord["lat"];

    // function that creates all content that belongs to MAP;
    function initMap() {
        let myLatlng = new google.maps.LatLng(`${cityCoordinateLat}`, `${cityCoordinateLon}`); // city coordinate;
        let mapSettings = {
            center: myLatlng,
            zoom: 10,
            disableDefaultUI: true, // this parameter remove all default tools on the map;
            draggable: false, // this method allows to pin a map (and users will not able to change the current position of city map);
            styles: mapStyles // adjusts map style;
        };
        //Current city map;
        let cityMap = new google.maps.Map(mapContainer, mapSettings);
        let infoWeatherWindowContent = ` <div class = 'mapDeskTemperature'>${cityMapTemperature}</div> <br><div class = 'iconDeskWeather'>${cityWeatherIcon}</div>`;
        let infoWeatherWindow = new google.maps.InfoWindow({ //adjusts the node desk on G-Map;
            content: infoWeatherWindowContent,
            position: myLatlng,
            map: cityMap,
        });
    };
    initMap();
};

// function that creates current time;
function currentTime() {
    let currentDate = new Date();

    // City Date;
    let cityDate = document.querySelector('.currentDate');
    let month = currentDate.getMonth();
    let day = currentDate.getDay();
    let dayOfmonth = currentDate.getDate();
    let daysArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; // weeck days array;
    let monthsArray = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.']; // wonths array;
    cityDate.innerHTML = `${daysArray[day]} ${dayOfmonth} ${monthsArray[month]}`; // showing on the page;

    // City Time;
    let cityTime = document.querySelector(".currentTime");
    let hour = currentDate.getHours();
    let minutes = currentDate.getMinutes();

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    cityTime.innerHTML = `${hour} : ${minutes}` // showing on the page;
};
currentTime();

cityId.onchange = getWeatherDate;


