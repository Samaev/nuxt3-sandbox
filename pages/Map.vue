<template>
 <div class="map-container" ref="mapContainer"></div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';

const { public: { mapBoxToken } } = useRuntimeConfig();
const mapContainer = ref(null);
let map, marker, animationFrame;

mapboxgl.accessToken = mapBoxToken;

// Новый маршрут: Ираклион → в море → Ретимно → в море → Ханья
const controlPoints = [
 [25.148254, 35.341846], // Порт Ираклиона
 [25.00, 35.60],         // севернее Ираклиона
 [24.60, 35.52],         // севернее Ретимно
 [24.40, 35.65],         // севернее Ханьи
 [24.0202, 35.5125],     // Порт Ханья
];

const steps = 300;

const animateRoute = (inputCoords) => {
 const line = turf.lineString(inputCoords);
 const spline = turf.bezierSpline(line, { sharpness: 0.85 });
 const distance = turf.length(spline);
 const arc = [];

 for (let i = 0; i < steps; i++) {
  const point = turf.along(spline, (distance / steps) * i);
  arc.push(point.geometry.coordinates);
 }

 let currentStep = 0;

 const animate = () => {
  if (currentStep >= arc.length) {
   cancelAnimationFrame(animationFrame);
   return;
  }

  const slicedArc = arc.slice(0, currentStep + 1);

  if (slicedArc.length >= 2 && !arePointsEqual(slicedArc[0], slicedArc[1])) {
   const slicedLine = turf.lineString(slicedArc);
   map.getSource('route').setData(slicedLine);
  }

  marker.setLngLat(arc[currentStep]);
  currentStep++;
  animationFrame = requestAnimationFrame(animate);
 };

 animationFrame = requestAnimationFrame(animate);
};

function arePointsEqual(a, b) {
 return a[0] === b[0] && a[1] === b[1];
}

const initializeMap = () => {
 map = new mapboxgl.Map({
  container: mapContainer.value,
  style: 'mapbox://styles/mapbox/light-v10',
  center: [24.8, 35.5],
  zoom: 8,
 });

 map.on('load', () => {
  const initialLine = turf.lineString([controlPoints[0], controlPoints[0]]);

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
    'line-color': '#EF4444',
    'line-width': 3,
    'line-dasharray': [1, 1], // Мелкий пунктир
   },
  });

  marker = new mapboxgl.Marker({ color: '#EF4444' })
    .setLngLat(controlPoints[0])
    .addTo(map);

  animateRoute(controlPoints);
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
