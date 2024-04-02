//display tile layer
  //add geojson-line to map
  var apiKey = '1b6ea57cdf04fbc8ef64e7419aac8237e52a528e47b9c644' // "Nhập khóa API eKMap Platform của bạn"  
  var $map = $('#map');
  const cities = JSON.parse($map.attr('cities'));
  var lng = 105.65153573250005;
  var lat = 20.97556311900006;
  var map = new vietmapgl.Map({
    container: "map",
    style:"https://maps.vietmap.vn/mt/tm/style.json?apikey="+apiKey, // stylesheet location
    center: [lng, lat], // starting position [lng, lat]
    zoom: 6,
    //pitch: 90, // starting zoom
    }); 
  map.on('load', () => {
    let fines = [];
    let errors = [];
    // Create the markers.

    cities.forEach(({id, title, latitude, longitude}) => {
    //marker.forEach(({position, title, homeid}) => {
    //  console.log(position);
   //   var  longitude = position.lng;
   //   var  latitude  = position.lat;
      const obj = {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [longitude, latitude]
        },
        'properties': {
          'name': title,
          'description': `<p style="color:black !important;">${title}</p>`,
          'id': id,
          "color": "yellow",
        },
      };
      if (id % 2 === 0) {       
        fines.push(obj);
      } else {
        errors.push(obj);
      }
    });
    console.log(fines,errors)
    map.addSource('cities_fine', {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': fines,
      }
    });
    map.addSource('cities_err', {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': errors,
      }
    });
    map.addLayer({
      'id': 'cities_fine',
      'type': 'circle',
      'source': 'cities_fine',
      'paint': {
        'circle-radius': 7,
        'circle-color': '#03fc17'
      }
    });
    map.addLayer({
      'id': 'cities_err',
      'type': 'circle',
      'source': 'cities_err',
      'paint': {
        'circle-radius': 7,
        'circle-color': '#fc1403'
      }
    });
  });  
  map.on('click', 'cities_fine', (e) => {
    onCityClick(map, e);
  });
  
  map.on('click', 'cities_err', (e) => {
    onCityClick(map, e);    
  });
  
  map.on('mouseenter', ['cities_fine', 'cities_err'], () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  
  map.on('mouseleave', ['cities_fine', 'cities_err'], () => {
    map.getCanvas().style.cursor = '';
  });

  function onCityClick(map, e) {
      
      var coordinates = e.features[0].geometry.coordinates.slice();
      var description = e.features[0].properties.description;
      var id = e.features[0].properties.id;
      console.log(id);       

      new vietmapgl.Popup()
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(map);

      $.ajax({
        type: 'GET',
        url: `/city/${id}/coordinates`,
        success: function (geometry) {
          map.removeLayer('route');
          if (map.getSource('route')) {
            map.removeSource('route');
          }
          
          // Handle the response data
          console.log('success', geometry);
          const geojson = {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'properties': {},
                geometry: geometry.geometry.geometry.coordinates,
            }
          };
          map.addSource('route', geojson);
          
          map.addLayer({
            'id': 'route',
            'type': 'line',
            'source': 'route',
            'layout': {
              'line-join': 'round',
              'line-cap': 'round'
            },
            'paint': {
              'line-color': '#ff9900',
              'line-width': 5
            }
          });
        },
        error: function (err) {
          console.log(err);
        }
      });
  }

  