<template>
 <div class="map-container" ref="mapContainer" />
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue'
const { public: {mapBoxToken} } = useRuntimeConfig();
import mapboxgl from 'mapbox-gl'
import * as turf from '@turf/turf'

const mapContainer = ref(null)
let map, marker, animationFrame

const origin = [30.5, 50.5]
const destination = [32.5, 51.5]

const duration = 5000
const steps = 300

mapboxgl.accessToken = mapBoxToken

const animateRoute = (route) => {
 const line = turf.lineString(route)
 const lineDistance = turf.length(line)
 const arc = []

 for (let i = 0; i < steps; i++) {
  arc.push(turf.along(line, (lineDistance / steps) * i).geometry.coordinates)
 }

 let currentStep = 0

 const animate = () => {
  if (currentStep >= arc.length) {
   cancelAnimationFrame(animationFrame)
   return
  }

  const slicedArc = arc.slice(0, currentStep + 1)

  // Не создаём линию, пока точек меньше 2
  if (slicedArc.length >= 2) {
   const slicedLine = turf.lineString(slicedArc)
   map.getSource('route').setData(slicedLine)
  }

  // Двигаем маркер даже по первой точке
  marker.setLngLat(arc[currentStep])

  currentStep++
  animationFrame = requestAnimationFrame(animate)
 }

 animationFrame = requestAnimationFrame(animate)
}

const initializeMap = () => {
 map = new mapboxgl.Map({
  container: mapContainer.value,
  style: 'mapbox://styles/mapbox/light-v10',
  center: origin,
  zoom: 5
 })

 map.on('load', () => {
  const initialLine = turf.lineString([origin])

  map.addSource('route', {
   type: 'geojson',
   data: initialLine
  })

  map.addLayer({
   id: 'route',
   type: 'line',
   source: 'route',
   layout: {
    'line-join': 'round',
    'line-cap': 'round'
   },
   paint: {
    'line-color': '#3b82f6',
    'line-width': 4
   }
  })

  marker = new mapboxgl.Marker({ color: '#EF4444' })
    .setLngLat(origin)
    .addTo(map)

  animateRoute([origin, destination])
 })
}

onMounted(() => {
 initializeMap()
})

onBeforeUnmount(() => {
 if (animationFrame) cancelAnimationFrame(animationFrame)
 if (map) map.remove()
})
</script>

<style scoped>
.map-container {
 width: 100%;
 height: 600px;
 border-radius: 1rem;
 overflow: hidden;
}
</style>
