/**
 * geoJSON extended action
 */

// config map
let config = {
    minZoom: 4,
    maxZomm: 18
};
// magnification with which the map will start
const zoom = 6;
// co-ordinates
const lat = 51.918904;
const lon = 19.1343786;

// calling map
const map = L.map("map", config).setView([lat, lon], zoom);

// Used to load and display tile layers on the map
// Most tile servers require attribution, which you can set under `Layer`
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// adding the province name to the visible div
function addTextToDiv(text) {
    const markerPlace = document.querySelector(".marker-position");
    markerPlace.textContent = text;
}

// showing the name of the province
function getVoivodeshipName(feature, layer) {
    if (feature.properties && feature.properties.name) {
        layer.bindPopup(feature.properties.name);
    }
}

// adding geojson by fetch
// of course you can use jquery, axios etc.
// fetch('./wojewodztwa-medium.geojson')
fetch(
    "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/poland.geojson"
)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var layer = new L.GeoJSON(data, {
            // A Function that will be called once for each
            // created Feature, after it has been created and styled
            onEachFeature: function (feature, layer) {
                layer.on("mouseover", function (e) {
                    // bindPopup
                    getVoivodeshipName(feature, layer);
                    // show voivodeship
                    addTextToDiv(feature.properties.name);
                    this.openPopup();
                    // style
                    this.setStyle({
                        fillColor: "#eb4034",
                        weight: 2,
                        color: "#eb4034",
                        fillOpacity: 0.7
                    });
                });
                layer.on("mouseout", function () {
                    this.closePopup();
                    // style
                    this.setStyle({
                        fillColor: "#3388ff",
                        weight: 2,
                        color: "#3388ff",
                        fillOpacity: 0.2
                    });
                });
                layer.on("click", function () {
                    // adding the province name to the visible div
                    addTextToDiv(feature.properties.name);
                });
            }
        }).addTo(map);
    });
