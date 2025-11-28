import './style.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;


const map = L.map('map').setView([38.9637, 35.2437], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let marker;


function searchLocation() {
    const country = document.getElementById("country").value;
    const city = document.getElementById("city").value;
    const district = document.getElementById("district").value;

    if (!country && !city && !district) {
        alert("Lütfen en az bir değer girin!");
        return;
    }

    const query = `${district ? district + "," : ""}${city ? city + "," : ""}${country}`;


    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                alert("Konum bulunamadı!");
                return;
            }

            const lat = data[0].lat;
            const lon = data[0].lon;

            showWeather(lat, lon);
        })
        .catch(err => console.error(err));
}


function showWeather(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=tr`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("location").textContent = `Konum: ${data.name}`;
            document.getElementById("temperature").textContent = `Sıcaklık: ${data.main.temp} °C`;
            document.getElementById("description").textContent = `Durum: ${data.weather[0].description}`;
            document.getElementById("feelsLike").textContent = `Hissedilen: ${data.main.feels_like} °C`;
            document.getElementById("humidity").textContent = `Nem: ${data.main.humidity}%`;
            document.getElementById("wind").textContent = `Rüzgar: ${data.wind.speed} km/h`;


            map.setView([lat, lon], 10);


            if (marker) map.removeLayer(marker);

            marker = L.marker([lat, lon]).addTo(map)
                .bindPopup(`<b>${data.name}</b><br>${data.weather[0].description}, ${data.main.temp}°C`)
                .openPopup();
        })
        .catch(err => console.error(err));
}

window.searchLocation = searchLocation;
