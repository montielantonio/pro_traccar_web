import { useTheme } from '@mui/material/styles';
import { useId, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { map } from './core/MapView';
import { findFonts } from './core/mapUtil';
import { useAttributePreference } from '../common/util/preferences';

const MapRouteCoordinates = ({ name, coordinates, deviceId }) => {
  const id = useId();

  const theme = useTheme();

  const reportColor = useSelector((state) => {
    const attributes = state.devices.items[deviceId]?.attributes;
    if (attributes) {
      const color = attributes['web.reportColor'];
      if (color) {
        return color;
      }
    }
    return theme.palette.geometry.main;
  });

  const mapLineWidth = useAttributePreference('mapLineWidth', 2);
  const mapLineOpacity = useAttributePreference('mapLineOpacity', 1);

  useEffect(() => {
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
      id: `${id}-line`,
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
    map.addLayer({
      source: id,
      id: `${id}-title`,
      type: 'symbol',
      layout: {
        'text-field': '{name}',
        'text-font': findFonts(map),
        'text-size': 12,
      },
      paint: {
        'text-halo-color': 'white',
        'text-halo-width': 1,
      },
    });

    return () => {
      if (map.getLayer(`${id}-title`)) {
        map.removeLayer(`${id}-title`);
      }
      if (map.getLayer(`${id}-line`)) {
        map.removeLayer(`${id}-line`);
      }
      if (map.getSource(id)) {
        map.removeSource(id);
      }
    };
  }, []);

  useEffect(() => {
    // Helper function to validate coordinates
    const isValidCoordinate = (coord) => {
      if (!Array.isArray(coord) || coord.length !== 2) return false;
      const [lon, lat] = coord;
      if (typeof lon !== 'number' || typeof lat !== 'number') return false;
      if (isNaN(lon) || isNaN(lat) || !isFinite(lon) || !isFinite(lat)) return false;
      if (lon < -180 || lon > 180 || lat < -90 || lat > 90) return false;
      return true;
    };
    
    // Calculate distance between two coordinates (Haversine formula) in kilometers
    const calculateDistance = (lon1, lat1, lon2, lat2) => {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };
    
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) {
      map.getSource(id)?.setData({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [],
        },
        properties: {
          name,
          color: reportColor,
          width: mapLineWidth,
          opacity: mapLineOpacity,
        },
      });
      return;
    }
    
    // Filter out invalid coordinates
    let validCoordinates = coordinates.filter(isValidCoordinate);
    
    if (validCoordinates.length < 2) {
      map.getSource(id)?.setData({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [],
        },
        properties: {
          name,
          color: reportColor,
          width: mapLineWidth,
          opacity: mapLineOpacity,
        },
      });
      return;
    }
    
    // Filter out GPS jumps
    const maxJumpDistance = 50; // Maximum reasonable distance in km between consecutive points
    const filteredCoordinates = [];
    
    for (let i = 0; i < validCoordinates.length; i++) {
      const coord = validCoordinates[i];
      
      if (filteredCoordinates.length === 0) {
        filteredCoordinates.push(coord);
      } else {
        const lastCoord = filteredCoordinates[filteredCoordinates.length - 1];
        const distance = calculateDistance(lastCoord[0], lastCoord[1], coord[0], coord[1]);
        
        // Only add point if distance is reasonable (filters GPS jumps)
        if (distance <= maxJumpDistance) {
          // Also filter out points that are too close together (< 10 meters)
          if (distance > 0.01 || i === validCoordinates.length - 1) {
            filteredCoordinates.push(coord);
          }
        }
      }
    }
    
    if (filteredCoordinates.length < 2) {
      filteredCoordinates = validCoordinates; // Fallback to original if filtering removes too many points
    }
    
    map.getSource(id)?.setData({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: filteredCoordinates,
      },
      properties: {
        name,
        color: reportColor,
        width: mapLineWidth,
        opacity: mapLineOpacity,
      },
    });
  }, [theme, coordinates, reportColor, mapLineWidth, mapLineOpacity, id, name]);

  return null;
};

export default MapRouteCoordinates;
