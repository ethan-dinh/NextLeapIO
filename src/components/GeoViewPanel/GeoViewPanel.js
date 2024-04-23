import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './GeoViewPanel.css'; // Make sure to create a CSS file for the map container

// Your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZGluaGUiLCJhIjoiY2xwMTBnYnZrMGQ2aDJrczVtb2FrYnJ3dSJ9.h0tUpCSX9MvaA-NirwN4rQ';

function GeoViewPanel() {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    // Initialize map when component mounts
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [-123.07218196442119, 44.044600230350085], // University of Oregon coordinates [lng, lat]
      zoom: 15.5 // starting zoom
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Clean up on unmount
    return () => map.remove();
  }, []); // Empty array ensures map initializes only once

  const mapHeight = '100%'; // This can be a state, prop, or any dynamic value

  return (
    <div id="mapContainer">
      <div ref={mapContainerRef} className="map-container" style={{ height: mapHeight }} />
    </div>
  );
}

export default GeoViewPanel;

