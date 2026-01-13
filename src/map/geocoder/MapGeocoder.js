import './geocoder.css';
import maplibregl from 'maplibre-gl';
import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTheme } from '@mui/material';
import { map } from '../core/MapView';
import { errorsActions } from '../../store';
import { useAttributePreference } from '../../common/util/preferences';

const MapGeocoder = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const googleKey = useAttributePreference('googleKey');

  useEffect(() => {
    const geocoder = {
      forwardGeocode: async (config) => {
        const features = [];
        try {
          if (googleKey) {
            // Use Google Geocoding API
            const request = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(config.query)}&key=${googleKey}`;
            const response = await fetch(request);
            const data = await response.json();
            
            if (data.status === 'OK' && data.results) {
              data.results.forEach((result) => {
                const location = result.geometry.location;
                features.push({
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [location.lng, location.lat],
                  },
                  place_name: result.formatted_address,
                  properties: result,
                  text: result.formatted_address,
                  place_type: result.types,
                  center: [location.lng, location.lat],
                });
              });
            }
          } else {
            // Fallback to OpenStreetMap Nominatim
          const request = `https://nominatim.openstreetmap.org/search?q=${config.query}&format=geojson&polygon_geojson=1&addressdetails=1`;
          const response = await fetch(request);
          const geojson = await response.json();
          geojson.features.forEach((feature) => {
            const center = [
              feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
              feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
            ];
            features.push({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: center,
              },
              place_name: feature.properties.display_name,
              properties: feature.properties,
              text: feature.properties.display_name,
              place_type: ['place'],
              center,
            });
          });
          }
        } catch (e) {
          dispatch(errorsActions.push(e.message));
        }
        return { features };
      },
    };

    const control = new MaplibreGeocoder(geocoder, {
      maplibregl,
      collapsed: true,
    });
    map.addControl(control, theme.direction === 'rtl' ? 'top-left' : 'top-right');
    return () => map.removeControl(control);
  }, [dispatch, googleKey, theme.direction]);

  return null;
};

export default MapGeocoder;
