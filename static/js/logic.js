console.log(tectonic);

var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryURL, function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    function pointToLayer(feature, latlng) {
        var eq = L.circle(latlng, {
            radius: feature.properties.mag * 40000,
            fillOpacity: 0.5,
            fillColor: chooseColor(feature.properties.mag),
            stroke: false
        });
        eq.bindPopup("<h3>" + feature.properties.place + "</h3><h4>Magnitude: " + String(feature.properties.mag) + "</h4><hr><p>"
        + new Date(feature.properties.time) + "</p>");
        return eq;
    }

    function chooseColor(mag) {
        if(mag < 1) {return "#E7F122"}
        else if (mag < 2) {return "#E5D820"}
        else if (mag < 3) {return "#E3C01E"}
        else if (mag < 4) {return "#E2A81D"}
        else if (mag < 5) {return "#E0901B"}
        else if (mag < 6) {return "#DE7719"}
        else if (mag < 7) {return "#DD5F18"}
        else if (mag < 8) {return "#DB4716"}
        else if (mag < 9) {return "#D92F14"}
        else if (mag < 10) {return "#D81713"}
        else {return "#FFFFFF"}
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: pointToLayer
    });

    var plates = L.geoJSON(tectonic);

    createMap(earthquakes, plates);
}

function createMap(earthquakes, plates) {
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets-satellite",
        accessToken: API_KEY
    });

    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    var baseMaps = {
        "Street": streetmap,
        "Satellite": satellite,
        "Light": lightmap,
        "Dark": darkmap
    };

    var overlayMaps = {
        Earthquakes: earthquakes,
        "Tectonic Plates": plates
    };

    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 3,
        layers: [darkmap, plates, earthquakes]
    });
    
    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);
}