import axios from 'axios';
import { $ } from './bling';

const mapOptions = {
  center: {},
  zoom: 10
};

function getLocation() {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(function (position) {
      resolve([position.coords.latitude, position.coords.longitude]);
    });
  });
}

function loadPlaces(map, lat, lng) {
  axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`)
      .then(res => {
        const places = res.data;

        if (!places) {
          return alert('No places found!');
        }

        const bounds = new google.maps.LatLngBounds();
        const infoWindow = new google.maps.InfoWindow();

        const markers = places.map(place => {
          const [placeLng, placeLat] = place.location.coordinates;
          const position = { lat: placeLat, lng: placeLng };
          bounds.extend(position);
          const marker = new google.maps.Marker({ map, position });
          marker.place = place;
          return marker;
        });

        markers.forEach(marker => marker.addListener('click', function () {
          const html = `
            <div class="popup">
              <a href="/store/${this.place.slug}">
                <img src="/uploads/${this.place.photo || 'store.png'}" alt="${this.place.name}">
                <span>${this.place.name} = ${this.place.location.address}</span>
              </a>
            </div>
          `;

          infoWindow.setContent(html);
          infoWindow.open(map, this);
        }));

        // zoom map to fit all markers
        map.setCenter(bounds.getCenter());
        map.fitBounds(bounds);
      });
}

function makeMap(mapDiv) {
  if (!mapDiv) return;

  let map;

  const location = getLocation();
  location.then((pos) => {
    mapOptions.center.lat = pos[0];
    mapOptions.center.lng = pos[1];

    map = new google.maps.Map(mapDiv, mapOptions);
    loadPlaces(map, pos[0], pos[1]);
  });

  const input = $('[name="geolocate"]');
  const autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();

    loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng());
  });
}

export default makeMap;
