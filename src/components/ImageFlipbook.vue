<template>
  <div class="pdf-site-content">
    <slot>
      <h1 class="pdf-title">
        <span v-for="(char, i) in 'Bienvenido a Pixel Ka\'an'" :key="i" :style="`--i:${i}`">{{ char === ' ' ? '\u00A0' : char }}</span>
      </h1>
      <h2 class="pdf-title">
        <span v-for="(char, i) in 'ANIMACIÓN DIGITAL ESCÁRCEGA'" :key="'h2-'+i" :style="`--i:${i}`">{{ char === ' ' ? '\u00A0' : char }}</span>
      </h2>
      <p class="pdf-desc">
        La revista que traza la cultura escarceguense.
      </p>
    </slot>
  </div>
  <div ref="flipbookContainerRef" class="image-flipbook-container">
    <div class="flipbook-controls">
      <button @click="goToPrevPage" title="Página anterior" class="control-btn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button @click="goToNextPage" title="Página siguiente" class="control-btn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      <input type="number" min="1" :max="totalPages" v-model.number="pageInput" @change="onPageInputChange" class="page-input" :title="`Ir a página (1-${totalPages})`" />
      <span class="page-label">/ {{ totalPages }}</span>
      <button @click="zoomOut" title="Alejar" class="control-btn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
      <span class="zoom-label">Zoom</span>
      <button @click="zoomIn" title="Acercar" class="control-btn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
      <button @click="resetZoomAndPan" title="Centrar y tamaño normal" class="control-btn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
      </button>
      <button @click="toggleFullscreen" title="Pantalla completa" class="control-btn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M16 3h3a2 2 0 0 1 2 2v3"/><path d="M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
      </button>
      <button @click="togglePanMode" :class="['control-btn', { active: isPanMode }]" title="Arrastrar libro (activar/desactivar)">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11V7a2 2 0 1 1 4 0v8"/><path d="M11 7a2 2 0 1 1 4 0v6"/><path d="M15 11a2 2 0 1 1 4 0v2a2 2 0 1 1-4 0v-2z"/><circle cx="12" cy="17" r="2"/></svg>
      </button>
    </div>
    <div ref="flipbookRef" class="flipbook-root"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import { PageFlip } from 'page-flip';

const validImages = ref([]);
const flipbookRef = ref(null);
const flipbookContainerRef = ref(null);
let pageFlipInstance = null;
const zoom = ref(1);
const minZoom = ref(1); // El zoom mínimo será 1 (ocupa el panel)
const isPanMode = ref(true); // Activado por defecto
let isPanning = false;
let panStart = null;
let panOrigin = { x: 0, y: 0 };
let imageList = [];
const pageInput = ref(1);
const totalPages = ref(0);

onMounted(async () => {
  let base = import.meta.env.BASE_URL.replace(/\/$/, '');
  let listaPath = `${base}/pdf/lista.json`;
  let files = [];
  try {
    const res = await fetch(listaPath);
    files = await res.json();
  } catch (e) {
    try {
      const res = await fetch('/pdf/lista.json');
      files = await res.json();
    } catch (err) {
      console.warn('No se pudo cargar lista.json en ninguna ruta');
      files = [];
    }
  }
  // Soporta ambos formatos: array de strings o array de objetos
  if (Array.isArray(files) && files.length && typeof files[0] === 'object') {
    imageList = files;
    validImages.value = files.map(f => `${base}/pdf/${f.src}`.replace(/\/+/g, '/'));
  } else {
    imageList = files.map(f => ({ src: f, hd: null }));
    validImages.value = files.map(f => `${base}/pdf/${f}`.replace(/\/+/g, '/'));
  }

  if (flipbookRef.value && validImages.value.length > 0) {
    pageFlipInstance = new PageFlip(flipbookRef.value, {
      width: 600,
      height: 800,
      size: 'stretch',
      minWidth: 315,
      minHeight: 420,
      maxWidth: 1000,
      maxHeight: 1350,
      maxShadowOpacity: 0.5,
      showCover: true,
      mobileScrollSupport: true
    });
    pageFlipInstance.loadFromImages(validImages.value);
    pageFlipInstance.on('flip', updateHDImagesIfNeeded);
    pageFlipInstance.on('flip', onFlip);
    totalPages.value = validImages.value.length;
    pageInput.value = 1;
    // Activar arrastre si está en modo pan al montar
    if (isPanMode.value) {
      flipbookRef.value.style.cursor = 'grab';
      flipbookRef.value.addEventListener('mousedown', startPan);
    }
  } else {
    console.warn('No images found for flipbook.');
  }
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

function updateHDImagesIfNeeded() {
  if (!pageFlipInstance || !imageList.length) return;
  // Si el zoom es alto, intentar cargar HD
  if (zoom.value > 1.15) {
    const imgs = Array.from(flipbookRef.value.querySelectorAll('img'));
    imgs.forEach((img, idx) => {
      const info = imageList[idx];
      if (info && info.hd) {
        const hdUrl = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/pdf/${info.hd}`.replace(/\/+/g, '/');
        if (!img.src.endsWith(info.hd)) img.src = hdUrl;
      }
    });
  } else {
    // Volver a la imagen normal si el zoom baja
    const imgs = Array.from(flipbookRef.value.querySelectorAll('img'));
    imgs.forEach((img, idx) => {
      const info = imageList[idx];
      if (info && info.src) {
        const normalUrl = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/pdf/${info.src}`.replace(/\/+/g, '/');
        if (!img.src.endsWith(info.src)) img.src = normalUrl;
      }
    });
  }
}

function resetZoomAndPan() {
  zoom.value = 1;
  if (flipbookRef.value) {
    flipbookRef.value.style.transform = `scale(1) translate(0, 0)`;
    flipbookRef.value.style.transition = 'transform 0.2s';
  }
  // Centrar el libro
  panOrigin = { x: 0, y: 0 };
}

function zoomIn() {
  zoom.value = Math.min(zoom.value + 0.1, 2);
  updateZoom();
  updateHDImagesIfNeeded();
}
function zoomOut() {
  zoom.value = Math.max(zoom.value - 0.1, minZoom.value);
  updateZoom();
  updateHDImagesIfNeeded();
}
function updateZoom() {
  if (flipbookRef.value) {
    flipbookRef.value.style.transform = `scale(${zoom.value}) translate(0, 0)`;
    flipbookRef.value.style.transition = 'transform 0.2s';
  }
}

function togglePanMode() {
  isPanMode.value = !isPanMode.value;
  if (isPanMode.value) {
    flipbookRef.value.style.cursor = 'grab';
    flipbookRef.value.addEventListener('mousedown', startPan);
  } else {
    flipbookRef.value.style.cursor = '';
    flipbookRef.value.removeEventListener('mousedown', startPan);
    if (isPanning) disablePan();
  }
}
function startPan(e) {
  isPanning = true;
  panStart = { x: e.clientX, y: e.clientY };
  const style = window.getComputedStyle(flipbookRef.value);
  const matrix = new DOMMatrixReadOnly(style.transform);
  panOrigin = { x: matrix.m41, y: matrix.m42 };
  window.addEventListener('mousemove', onPan);
  window.addEventListener('mouseup', disablePan);
  flipbookRef.value.style.cursor = 'grabbing';
}
function onPan(e) {
  if (!isPanning) return;
  const dx = e.clientX - panStart.x;
  const dy = e.clientY - panStart.y;
  flipbookRef.value.style.transform = `scale(${zoom.value}) translate(${panOrigin.x + dx}px, ${panOrigin.y + dy}px)`;
}
function disablePan() {
  isPanning = false;
  window.removeEventListener('mousemove', onPan);
  window.removeEventListener('mouseup', disablePan);
  if (isPanMode.value) {
    flipbookRef.value.style.cursor = 'grab';
  } else {
    flipbookRef.value.style.cursor = '';
  }
}

function toggleFullscreen() {
  const el = flipbookContainerRef.value;
  if (!el) return;
  if (!document.fullscreenElement) {
    el.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function goToPrevPage() {
  if (pageFlipInstance) pageFlipInstance.flipPrev();
}
function goToNextPage() {
  if (pageFlipInstance) pageFlipInstance.flipNext();
}

function onPageInputChange() {
  if (!pageFlipInstance) return;
  let page = Math.max(1, Math.min(pageInput.value, totalPages.value));
  pageInput.value = page;
  pageFlipInstance.flip(page - 1);
}

// Actualizar el input cuando cambia la página
function onFlip(e) {
  pageInput.value = e.data + 1;
}

function handleKeydown(e) {
  if (e.key === 'ArrowLeft') {
    goToPrevPage();
  } else if (e.key === 'ArrowRight') {
    goToNextPage();
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Permanent+Marker&family=Montserrat:wght@600&family=Playfair+Display:wght@700&display=swap');

.pdf-site-content {
  padding-top: 0rem;
  padding-bottom: 0rem;
  background: transparent;
  text-align: center;
  box-shadow: none;
  margin: 0;
}

.pdf-title {
  margin-top: 1rem;
  font-size: 2.8rem;
  letter-spacing: 3px;
  line-height: 1.1;
  color: #3c8cff;
  font-weight: 900;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.1em;
}

.pdf-title span {
  display: inline-block;
  animation: moon-wave-title 2.5s linear infinite;
  animation-delay: calc(var(--i) * 0.12s);
}

@keyframes moon-wave-title {
  0%   { transform: translateY(0) scale(1) rotate(0deg); }
  20%  { transform: translateY(-8px) scale(1.08) rotate(-2deg); }
  40%  { transform: translateY(-12px) scale(1.12) rotate(-4deg); }
  60%  { transform: translateY(-8px) scale(1.08) rotate(-2deg); }
  80%  { transform: translateY(0) scale(1) rotate(0deg); }
  100% { transform: translateY(0) scale(1) rotate(0deg); }
}

.pdf-desc {
  max-width: 700px;
  margin: 0 auto 1.2rem auto;
  font-size: 1.3rem;
  font-family: 'Playfair Display', 'Montserrat', 'Arial', sans-serif;
  font-weight: 600;
  letter-spacing: 1.5px;
  color: #ffb300;
  background: none;
  background-clip: initial;
  -webkit-background-clip: initial;
  -webkit-text-fill-color: initial;
  animation: none;
  text-shadow:
    0px 4px 12px #000a,
    0px 0px 2px #fff;
  display: inline-block;
  animation: moon-wave 3s linear infinite;
  position: relative;
}

@keyframes moon-wave {
  0%   { transform: translateY(0); letter-spacing: 1.5px; }
  10%  { transform: translateY(-2px) translateX(2px) rotate(-1deg); }
  20%  { transform: translateY(-4px) translateX(4px) rotate(-2deg); }
  30%  { transform: translateY(-6px) translateX(6px) rotate(-3deg); }
  40%  { transform: translateY(-4px) translateX(4px) rotate(-2deg); }
  50%  { transform: translateY(0) translateX(0) rotate(0deg); }
  60%  { transform: translateY(4px) translateX(-4px) rotate(2deg); }
  70%  { transform: translateY(6px) translateX(-6px) rotate(3deg); }
  80%  { transform: translateY(4px) translateX(-4px) rotate(2deg); }
  90%  { transform: translateY(2px) translateX(-2px) rotate(1deg); }
  100% { transform: translateY(0); letter-spacing: 1.5px; }
}

.image-flipbook-container {
  width: 98vw;
  height: 100dvh;
  background: #222;
  position: relative;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.flipbook-controls {
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  z-index: 200;
  background: #222d;
  border-radius: 1.5em;
  box-shadow: 0 2px 8px #0006;
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.4em 1em;
}
.control-btn {
  background: transparent;
  border: none;
  border-radius: 0.4em;
  width: 2.5em;
  height: 2.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  color: #fff;
  box-shadow: none;
  outline: none;
  margin: 0;
  padding: 0;
}
.control-btn svg {
  display: block;
  margin: auto;
}
.control-btn:hover, .control-btn.active {
  background: #3c8cff;
  color: #fff;
  box-shadow: 0 2px 8px #0003;
}

.flipbook-root {
  background: transparent;
  border-radius: 0;
  margin: 0;
  padding: 0;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: auto;
  max-width: 100vw;
  max-height: 100vh;
  box-sizing: border-box;
}

.flipbook-root img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  width: auto;
  height: auto;
  display: block;
  margin: 0 auto;
}

.pan-btn {
  background: #fff2;
  border: none;
  border-radius: 50%;
  width: 2em;
  height: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  transition: background 0.2s, transform 0.2s;
}
.pan-btn.active, .pan-btn:active {
  background: #3c8cff;
  color: #fff;
  cursor: grab;
}
.pan-btn svg {
  pointer-events: none;
}

.fullscreen-btn {
  background: #fff2;
  border: none;
  border-radius: 50%;
  width: 2em;
  height: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  margin-left: 0.2em;
}
.fullscreen-btn:hover {
  background: #3c8cff;
  color: #fff;
}

.page-input {
  width: 3em;
  text-align: center;
  font-size: 1em;
  border: 1px solid #3c8cff;
  border-radius: 0.3em;
  background: #222;
  color: #fff;
  margin: 0 0.2em;
  outline: none;
  height: 2.2em;
}
.page-label {
  color: #fff;
  font-size: 1em;
  margin-right: 0.5em;
}

@media (max-width: 900px) {
  .flipbook-root {
    width: 98vw;
    height: 70vw;
    max-width: 98vw;
    max-height: 80vh;
  }
  .flipbook-controls {
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.3em 0.7em;
    gap: 0.3em;
  }
  .pdf-title {
    font-size: 1.5rem;
    margin-top: 0.5rem;
  }
  .pdf-desc {
    font-size: 1rem;
    max-width: 95vw;
  }
}

@media (max-width: 600px) {
  .flipbook-root {
    width: 100vw;
    height: 60vw;
    min-width: 0;
    min-height: 0;
    max-width: 100vw;
    max-height: 60vh;
  }
  .pdf-site-content {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  .pdf-title {
    font-size: 1.1rem;
    margin-top: 0.2rem;
    letter-spacing: 1px;
  }
  .pdf-desc {
    font-size: 0.9rem;
    max-width: 98vw;
  }
  .flipbook-controls {
    top: 0.2rem;
    right: 0.2rem;
    padding: 0.2em 0.4em;
    gap: 0.2em;
  }
}
</style>

<!-- Cambia el div principal del flipbook para usar ref -->