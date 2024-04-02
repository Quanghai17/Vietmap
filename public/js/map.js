// Init map
var map = L.map('map').setView([21.0285, 105.8542], 7);

// add tile map
L.tileLayer('https://maps.vietmap.vn/api/tm/{z}/{x}/{y}?apikey=1b6ea57cdf04fbc8ef64e7419aac8237e52a528e47b9c644', {
  maxZoom: 19,
}).addTo(map);


var cities = [
  { name: "Hà Nội", coordinates: [21.0285, 105.8542], status: "fine" },
  { name: "Hồ Chí Minh", coordinates: [10.7769, 106.7009], status: "error" },
  { name: "Đà Nẵng", coordinates: [16.0544, 108.2022], status: "fine" },
  { name: "Hải Phòng", coordinates: [20.8623, 106.6830], status: "fine" },
  { name: "Cần Thơ", coordinates: [10.0455, 105.7468], status: "error" },
  
]; 


cities.map(e => {
  let color;
    if (e.status === 'fine') {
        color = 'green';
    } else if (e.status === 'error') {
        color = 'red';
    }

  let circleMarker = L.circleMarker([e.coordinates[0], e.coordinates[1]], {
    color: color, 
    fillColor: color, 
    fillOpacity: 1, 
    radius: 8 
  }).addTo(map).bindPopup(e.name);
  
  circleMarker.on('click', function (event) {
    let dataPolygon = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {
            color: 'red'
          },
          "geometry": {
            "coordinates": [
              [
                [
                  106.35773444981493,
                  10.627154998778352
                ],
                [
                  106.35680564974575,
                  10.559339999567229
                ],
                [
                  106.41234498380754,
                  10.520622043477601
                ],
                [
                  106.49211966364322,
                  10.504736347044457
                ],
                [
                  106.56078647666578,
                  10.542463540337508
                ],
                [
                  106.61119578076745,
                  10.570578063086884
                ],
                [
                  106.62836247755206,
                  10.64799649170753
                ],
                [
                  106.57686236779648,
                  10.685706044648953
                ],
                [
                  106.55464663417615,
                  10.743253697518597
                ],
                [
                  106.44053854785301,
                  10.74027736320474
                ],
                [
                  106.3769207652137,
                  10.696621094637877
                ],
                [
                  106.35773444981493,
                  10.627154998778352
                ]
              ]
            ],
            "type": "Polygon"
          }
        }
      ]
    }
    
    L.geoJSON(dataPolygon, {
      style: function (feature) {
        return { color: feature.properties.color };
      }
    }).bindPopup(function (layer) {
      return layer.feature.properties.description;
    }).addTo(map);
  })
})


