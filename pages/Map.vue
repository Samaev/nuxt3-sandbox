<template>
 <div class="map-container" ref="mapContainer"></div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue'
const { public: { mapBoxToken } } = useRuntimeConfig()
import mapboxgl from 'mapbox-gl'
import * as turf from '@turf/turf'

const mapContainer = ref(null)
let map, marker, animationFrame

// Начальные и конечные точки маршрута
const origin = [23.7275, 37.9838] // Афины
const heraklion = [25.1442, 35.3387] // Ираклион (Крит)
const chania = [24.0158, 35.5176] // Ханья (Крит)

const duration = 5000 // Длительность анимации в миллисекундах
const steps = 300 // Количество шагов для анимации
const waveAmplitude = 0.01 // Амплитуда волны (параметр для "волн")
const waveFrequency = 0.1 // Частота волны, для создания кривизны

mapboxgl.accessToken = mapBoxToken

// Функция для генерации волнистого маршрута (Афины - Ираклион)
const generateWaveRoute = (start, middle, end) => {
 const line1 = turf.lineString([start, middle]) // Афины - Ираклион
 const line2 = turf.lineString([middle, end]) // Ираклион - Ханья
 const lineDistance1 = turf.length(line1)
 const lineDistance2 = turf.length(line2)

 const arc = []

 // Генерация точек с волной вдоль первого сегмента (Афины - Ираклион)
 for (let i = 0; i < steps; i++) {
  const point = turf.along(line1, (lineDistance1 / steps) * i).geometry.coordinates
  const waveEffect = Math.sin(i * waveFrequency) * waveAmplitude
  point[1] += waveEffect
  arc.push(point)
 }

 // Генерация точек вдоль побережья (Ираклион - Ханья)
 // Используем небольшие отклонения для волнистого пути
 for (let i = 0; i < steps; i++) {
  const point = turf.along(line2, (lineDistance2 / steps) * i).geometry.coordinates
  const waveEffect = Math.sin(i * waveFrequency) * waveAmplitude * 0.5 // Уменьшаем эффект волны на этом участке
  point[1] += waveEffect
  arc.push(point)
 }

 return arc
}

// Функция для анимации маршрута
const animateRoute = (route) => {
 let currentStep = 0

 // Функция анимации
 const animate = () => {
  if (currentStep >= route.length) {
   cancelAnimationFrame(animationFrame)
   return
  }

  const slicedArc = route.slice(0, currentStep + 1)

  // Отображаем линию только при наличии хотя бы двух точек
  if (slicedArc.length >= 2) {
   const slicedLine = turf.lineString(slicedArc)
   map.getSource('route').setData(slicedLine)
  }

  // Двигаем маркер по пути
  marker.setLngLat(route[currentStep])

  currentStep++
  animationFrame = requestAnimationFrame(animate)
 }

 animationFrame = requestAnimationFrame(animate)
}

// Инициализация карты
const initializeMap = () => {
 map = new mapboxgl.Map({
  container: mapContainer.value,
  style: 'mapbox://styles/mapbox/light-v10',
  center: origin,
  zoom: 8
 })

 map.on('load', () => {
  const initialLine = turf.lineString([origin, origin])

  // Добавляем исходный источник для маршрута
  map.addSource('route', {
   type: 'geojson',
   data: initialLine
  })

  // Добавляем слой для отображения маршрута
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

  // Создаём маркер
  marker = new mapboxgl.Marker({ color: '#EF4444' })
    .setLngLat(origin)
    .addTo(map)

  // Генерация волнистого маршрута (Афины - Ираклион - Ханья)
  const waveRoute = generateWaveRoute(origin, heraklion, chania)

  // Запускаем анимацию маршрута
  animateRoute(waveRoute)
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
