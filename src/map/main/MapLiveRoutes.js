import { useId, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { map } from '../core/MapView';
import { useAttributePreference } from '../../common/util/preferences';

const MapLiveRoutes = ({ deviceIds }) => {
  const id = useId();

  const theme = useTheme();

  const type = useAttributePreference('mapLiveRoutes', 'all');

  const devices = useSelector((state) => state.devices.items);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const history = useSelector((state) => state.session.history);

  const mapLineWidth = useAttributePreference('mapLineWidth', 2);
  const mapLineOpacity = useAttributePreference('mapLineOpacity', 1);

  useEffect(() => {
    if (type !== 'none') {
      map.addSource(id, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [],
          },
        },
      });
      map.addLayer({
        source: id,
        id,
        type: 'line',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': ['get', 'width'],
          'line-opacity': ['get', 'opacity'],
        },
      });

      return () => {
        if (map.getLayer(id)) {
          map.removeLayer(id);
        }
        if (map.getSource(id)) {
          map.removeSource(id);
        }
      };
    }
    return () => {};
  }, [type]);

  useEffect(() => {
    if (type !== 'none') {
      // Helper function to validate coordinates
      const isValidCoordinate = (coord) => {
        if (!Array.isArray(coord) || coord.length !== 2) return false;
        const [lon, lat] = coord;
        if (typeof lon !== 'number' || typeof lat !== 'number') return false;
        if (isNaN(lon) || isNaN(lat) || !isFinite(lon) || !isFinite(lat)) return false;
        if (lon < -180 || lon > 180 || lat < -90 || lat > 90) return false;
        return true;
      };
      
      const visibleIds = deviceIds
        .filter((id) => (type === 'selected' ? id === selectedDeviceId : true))
        .filter((id) => history.hasOwnProperty(id) && history[id] && history[id].length >= 2);

      map.getSource(id)?.setData({
        type: 'FeatureCollection',
        features: visibleIds.map((deviceId) => {
          // Filter out invalid coordinates from the route
          const validCoordinates = history[deviceId].filter(isValidCoordinate);
          
          // Only create feature if we have at least 2 valid points
          if (validCoordinates.length < 2) {
            return null;
          }
          
          return {
          type: 'Feature',
          geometry: {
            type: 'LineString',
              coordinates: validCoordinates,
          },
          properties: {
              color: devices[deviceId]?.attributes['web.reportColor'] || theme.palette.geometry.main,
            width: mapLineWidth,
            opacity: mapLineOpacity,
          },
          };
        }).filter(Boolean), // Remove null entries
      });
    }
  }, [theme, type, devices, selectedDeviceId, history, deviceIds, mapLineWidth, mapLineOpacity, id]);

  return null;
};

export default MapLiveRoutes;
