import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { googleProtocol } from 'maplibre-google-maps';
import React, {
  useRef, useLayoutEffect, useEffect, useState,
  useMemo,
} from 'react';
import { useTheme } from '@mui/material';
import { SwitcherControl } from '../switcher/switcher';
import { useAttributePreference, usePreference } from '../../common/util/preferences';
import usePersistedState, { savePersistedState } from '../../common/util/usePersistedState';
import { mapImages } from './preloadImages';
import useMapStyles from './useMapStyles';
import { useEffectAsync } from '../../reactHelper';
import { loadImage, prepareIcon } from './mapUtil';
import backgroundSvg from '../../resources/images/background.svg';
import defaultSvg from '../../resources/images/icon/default.svg';

const element = document.createElement('div');
element.style.width = '100%';
element.style.height = '100%';
element.style.boxSizing = 'initial';

maplibregl.addProtocol('google', googleProtocol);

export const map = new maplibregl.Map({
  container: element,
  attributionControl: false,
});

let ready = false;
const readyListeners = new Set();

const addReadyListener = (listener) => {
  readyListeners.add(listener);
  listener(ready);
};

const removeReadyListener = (listener) => {
  readyListeners.delete(listener);
};

const updateReadyValue = (value) => {
  ready = value;
  readyListeners.forEach((listener) => listener(value));
};

let defaultPoiIcon = null;

const initMap = async () => {
  if (ready) return;
  if (!map.hasImage('background')) {
    Object.entries(mapImages).forEach(([key, value]) => {
      map.addImage(key, value, {
        pixelRatio: window.devicePixelRatio,
      });
    });
  }
  // Preload default icon for POI placeholders
  if (!defaultPoiIcon) {
    try {
      const background = await loadImage(backgroundSvg);
      const defaultIcon = await loadImage(defaultSvg);
      defaultPoiIcon = prepareIcon(background, defaultIcon, '#666666');
    } catch (err) {
      console.warn('Failed to load default POI icon:', err);
    }
  }
};

const MapView = ({ children }) => {
  const theme = useTheme();

  const containerEl = useRef(null);

  const [mapReady, setMapReady] = useState(false);

  const mapStyles = useMapStyles();
  const activeMapStyles = useAttributePreference('activeMapStyles', 'locationIqStreets,locationIqDark,openFreeMap');
  const [defaultMapStyle] = usePersistedState('selectedMapStyle', usePreference('map', 'locationIqStreets'));
  const mapboxAccessToken = useAttributePreference('mapboxAccessToken');
  const maxZoom = useAttributePreference('web.maxZoom');

  const switcher = useMemo(() => new SwitcherControl(
    () => updateReadyValue(false),
    (styleId) => savePersistedState('selectedMapStyle', styleId),
    () => {
      map.once('styledata', () => {
        const waiting = () => {
          if (!map.loaded()) {
            setTimeout(waiting, 33);
          } else {
            initMap();
            updateReadyValue(true);
          }
        };
        waiting();
      });
    },
  ), []);

  useEffectAsync(async () => {
    if (theme.direction === 'rtl') {
      maplibregl.setRTLTextPlugin('/mapbox-gl-rtl-text.js');
    }
  }, [theme.direction]);

  useEffect(() => {
    const attribution = new maplibregl.AttributionControl({ compact: true });
    const navigation = new maplibregl.NavigationControl();
    map.addControl(attribution, theme.direction === 'rtl' ? 'bottom-left' : 'bottom-right');
    map.addControl(navigation, theme.direction === 'rtl' ? 'top-left' : 'top-right');
    map.addControl(switcher, theme.direction === 'rtl' ? 'top-left' : 'top-right');
    return () => {
      map.removeControl(switcher);
      map.removeControl(navigation);
      map.removeControl(attribution);
    };
  }, [theme.direction, switcher]);

  useEffect(() => {
    if (maxZoom) {
      map.setMaxZoom(maxZoom);
    }
  }, [maxZoom]);

  useEffect(() => {
    maplibregl.accessToken = mapboxAccessToken;
  }, [mapboxAccessToken]);

  useEffect(() => {
    const filteredStyles = mapStyles.filter((s) => s.available && activeMapStyles.includes(s.id));
    const styles = filteredStyles.length ? filteredStyles : mapStyles.filter((s) => s.id === 'osm');
    switcher.updateStyles(styles, defaultMapStyle);
  }, [mapStyles, defaultMapStyle, activeMapStyles, switcher]);

  useEffect(() => {
    const listener = (ready) => setMapReady(ready);
    addReadyListener(listener);
    return () => {
      removeReadyListener(listener);
    };
  }, []);

  useEffect(() => {
    // Create a simple transparent placeholder image synchronously
    const createPlaceholderImage = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      // Create transparent image
      ctx.clearRect(0, 0, 16, 16);
      return ctx.getImageData(0, 0, 16, 16);
    };

    const placeholderImage = createPlaceholderImage();

    // Handle missing POI icons from map styles
    const handleStyleImageMissing = (e) => {
      // Handle missing POI-style images (like "-11", "convenience-11")
      if (e.id && (e.id.startsWith('-') || e.id.match(/^[a-z]+-\d+$/))) {
        try {
          // Use placeholder image to prevent warnings
          map.addImage(e.id, placeholderImage);
        } catch (err) {
          // Silently ignore if image can't be added
        }
      }
    };

    map.on('styleimagemissing', handleStyleImageMissing);
    return () => {
      map.off('styleimagemissing', handleStyleImageMissing);
    };
  }, []);

  useLayoutEffect(() => {
    const currentEl = containerEl.current;
    currentEl.appendChild(element);
    map.resize();
    return () => {
      currentEl.removeChild(element);
    };
  }, [containerEl]);

  return (
    <div style={{ width: '100%', height: '100%' }} ref={containerEl}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type.handlesMapReady) {
          return React.cloneElement(child, { mapReady });
        }
        return mapReady ? child : null;
      })}
    </div>
  );
};

export default MapView;
