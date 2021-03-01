import { env } from '../../config/defaults';
import { context } from 'services/context';

export function getLocation() {
  let options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };

  if (getNavigator() && getNavigator().permissions && getNavigator().permissions.query) {
    getNavigator()
      .permissions.query({ name: 'geolocation' })
      .then(
        function (result) {
          if (result.state === 'granted' && getNavigator().onLine) {
            getNavigator().geolocation.getCurrentPosition(locationShared, notShared, options);
          } else {
            context.ee.emit('emitTmx', { notice: 'Connection', client: 'tmx' });
          }
        },
        (err) => console.log('error:', err)
      );
  }
}

export function notShared(err) {
  console.log('location not shared error:', err);
  context.ee.emit('emitTmx', {
    event: 'Connection',
    notice: `lat/lng: Geolocation Not Shared`,
    latitude: '0.00',
    longitude: '0.00'
  });
}

export function locationShared(pos) {
  env.locations.geoposition = pos;
  context.ee.emit('emitTmx', {
    geoposition: {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    }
  });
}

function getNavigator() {
  try {
    return navigator || window.navigator;
  } catch (e) {
    return undefined;
  }
}
