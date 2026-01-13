import { useTheme } from '@mui/material/styles';
import { useId, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { map } from './core/MapView';
import getSpeedColor from '../common/util/colors';
import { useAttributePreference } from '../common/util/preferences';

const MapRoutePath = ({ positions }) => {
  const id = useId();

  const theme = useTheme();

  const reportColor = useSelector((state) => {
    const position = positions?.find(() => true);
    if (position) {
      const attributes = state.devices.items[position.deviceId]?.attributes;
      if (attributes) {
        const color = attributes['web.reportColor'];
        if (color) {
          return color;
        }
      }
    }
    return null;
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

    return () => {
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
    const isValidCoordinate = (lon, lat) => {
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
    
    // Filter out positions with invalid coordinates
    let validPositions = positions.filter((p) => 
      isValidCoordinate(p.longitude, p.latitude)
    );
    
    // Sort by fixTime to ensure correct chronological order
    validPositions = validPositions.sort((a, b) => {
      const timeA = new Date(a.fixTime || a.deviceTime || 0).getTime();
      const timeB = new Date(b.fixTime || b.deviceTime || 0).getTime();
      return timeA - timeB;
    });
    
    if (validPositions.length < 2) {
      map.getSource(id)?.setData({
        type: 'FeatureCollection',
        features: [],
      });
      return;
    }
    
    // Filter out GPS jumps and create smooth route
    const filteredCoordinates = [];
    const maxJumpDistance = 50; // Maximum reasonable distance in km between consecutive points
    
    for (let i = 0; i < validPositions.length; i++) {
      const pos = validPositions[i];
      const coord = [pos.longitude, pos.latitude];
      
      if (filteredCoordinates.length === 0) {
        // Always add first point
        filteredCoordinates.push(coord);
      } else {
        const lastCoord = filteredCoordinates[filteredCoordinates.length - 1];
        const distance = calculateDistance(lastCoord[0], lastCoord[1], coord[0], coord[1]);
        
        // Only add point if distance is reasonable (filters GPS jumps)
        if (distance <= maxJumpDistance) {
          // Also filter out points that are too close together (< 10 meters) to reduce clutter
          if (distance > 0.01 || i === validPositions.length - 1) {
            filteredCoordinates.push(coord);
          }
        }
      }
    }
    
    if (filteredCoordinates.length < 2) {
      map.getSource(id)?.setData({
        type: 'FeatureCollection',
        features: [],
      });
      return;
    }
    
    // Create a single LineString for the entire route
    const minSpeed = validPositions.map((p) => p.speed || 0).reduce((a, b) => Math.min(a, b), Infinity);
    const maxSpeed = validPositions.map((p) => p.speed || 0).reduce((a, b) => Math.max(a, b), -Infinity);
    
    map.getSource(id)?.setData({
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: filteredCoordinates,
        },
        properties: {
          color: reportColor || theme.palette.geometry.main,
          width: mapLineWidth,
          opacity: mapLineOpacity,
        },
      }],
    });
  }, [theme, positions, reportColor, mapLineWidth, mapLineOpacity, id]);

  return null;
};

export default MapRoutePath;
