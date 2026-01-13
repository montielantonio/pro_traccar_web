import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'session',
  initialState: {
    server: null,
    user: null,
    socket: null,
    includeLogs: false,
    logs: [],
    positions: {},
    history: {},
  },
  reducers: {
    updateServer(state, action) {
      state.server = action.payload;
    },
    updateUser(state, action) {
      state.user = action.payload;
    },
    updateSocket(state, action) {
      state.socket = action.payload;
    },
    enableLogs(state, action) {
      state.includeLogs = action.payload;
      if (!action.payload) {
        state.logs = [];
      }
    },
    updateLogs(state, action) {
      state.logs.push(...action.payload);
    },
    updatePositions(state, action) {
      const liveRoutes = state.user.attributes.mapLiveRoutes || state.server.attributes.mapLiveRoutes || 'all';
      const liveRoutesLimit = state.user.attributes['web.liveRouteLength'] || state.server.attributes['web.liveRouteLength'] || 100;
      
      // Helper function to validate coordinates
      const isValidCoordinate = (lon, lat) => {
        // Check if coordinates are valid numbers
        if (typeof lon !== 'number' || typeof lat !== 'number') return false;
        if (isNaN(lon) || isNaN(lat) || !isFinite(lon) || !isFinite(lat)) return false;
        // Check if coordinates are within valid ranges
        if (lon < -180 || lon > 180 || lat < -90 || lat > 90) return false;
        return true;
      };
      
      // Helper function to check for sudden jumps (likely bad GPS data)
      const isReasonableDistance = (lon1, lat1, lon2, lat2, maxDistanceKm = 50) => {
        if (!lon1 || !lat1) return true; // First point, always valid
        // Haversine formula for distance calculation
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance <= maxDistanceKm;
      };
      
      action.payload.forEach((position) => {
        // Only update position if coordinates are valid
        if (isValidCoordinate(position.longitude, position.latitude)) {
        state.positions[position.deviceId] = position;
          
        if (liveRoutes !== 'none') {
          const route = state.history[position.deviceId] || [];
          const last = route.at(-1);
            
            // Check if position has changed and is valid
            const positionChanged = !last || last[0] !== position.longitude || last[1] !== position.latitude;
            const isReasonable = !last || isReasonableDistance(last[0], last[1], position.longitude, position.latitude);
            
            // Add point if position changed and distance is reasonable (filters out GPS jumps)
            if (positionChanged && isReasonable) {
            state.history[position.deviceId] = [...route.slice(1 - liveRoutesLimit), [position.longitude, position.latitude]];
          }
        } else {
          state.history = {};
          }
        }
      });
    },
  },
});

export { actions as sessionActions };
export { reducer as sessionReducer };
