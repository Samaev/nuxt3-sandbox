<template>
 <div class="map-container" ref="mapContainer"></div>
</template>

<script setup>
import {onMounted, ref, onBeforeUnmount} from 'vue';

const {public: {mapBoxToken}} = useRuntimeConfig();
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';

const mapContainer = ref(null);
let map, marker, animationFrame;

mapboxgl.accessToken = mapBoxToken;

// Координаты маршрута: Ираклион → в море → Ретимно → в море → Ханья
const routeCoords = [
 [25.148254, 35.341846], // Порт Ираклиона
 [25.0000, 35.5000],     // В море, севернее Ираклиона
 [24.7000, 35.5000],     // В море, севернее Ретимно
 [24.4823, 35.3656],     // Порт Ретимно
 [24.3000, 35.6000],     // В море, севернее Ханьи
 [24.0202, 35.5125],     // Порт Ханья
];

const steps = 300;

const animateRoute = (route) => {
 const line = turf.lineString(route);
 const lineDistance = turf.length(line);
 const arc = [];

 for (let i = 0; i < steps; i++) {
  arc.push(turf.along(line, (lineDistance / steps) * i).geometry.coordinates);
 }

 let currentStep = 0;

 const animate = () => {
  if (currentStep >= arc.length) {
   cancelAnimationFrame(animationFrame);
   return;
  }

  const slicedArc = arc.slice(0, currentStep + 1);

  if (slicedArc.length >= 2) {
   const slicedLine = turf.lineString(slicedArc);
   map.getSource('route').setData(slicedLine);
  }

  marker.setLngLat(arc[currentStep]);

  currentStep++;
  animationFrame = requestAnimationFrame(animate);
 };

 animationFrame = requestAnimationFrame(animate);
};

const initializeMap = () => {
 map = new mapboxgl.Map({
  container: mapContainer.value,
  style: 'mapbox://styles/mapbox/light-v10',
  center: [24.8, 35.4],
  zoom: 8,
 });

 map.on('load', () => {
  const initialLine = turf.lineString([routeCoords[0], routeCoords[0]]);

  map.addSource('route', {
   type: 'geojson',
   data: initialLine,
  });

  map.addLayer({
   id: 'route',
   type: 'line',
   source: 'route',
   layout: {
    'line-join': 'round',
    'line-cap': 'round',
   },
   paint: {
    'line-color': '#3b82f6',
    'line-width': 4,
   },
  });

  marker = new mapboxgl.Marker({color: '#EF4444'})
    .setLngLat(routeCoords[0])
    .addTo(map);

  animateRoute(routeCoords);
 });
};

onMounted(() => {
 initializeMap();
});

onBeforeUnmount(() => {
 if (animationFrame) cancelAnimationFrame(animationFrame);
 if (map) map.remove();
});
</script>

<style scoped>
.map-container {
 width: 100%;
 height: 600px;
 border-radius: 1rem;
 overflow: hidden;
}
</style>
