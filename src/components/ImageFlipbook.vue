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
  <div class="image-flipbook-container">
    <div ref="flipbookRef" class="flipbook-root"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { PageFlip } from 'page-flip';

const validImages = ref([]);
const flipbookRef = ref(null);
let pageFlipInstance = null;

onMounted(async () => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  // Carga la lista de imágenes generada por el script
  const res = await fetch(`${base}/pdf/lista.json`);
  const files = await res.json();
  // Elimina doble slash si base termina en / o si no
  validImages.value = files.map(f => `${base}/pdf/${f}`.replace(/\/+/g, '/'));

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
  } else {
    console.warn('No images found for flipbook.');
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Permanent+Marker&family=Montserrat:wght@600&display=swap');
@font-face {
  font-family: 'Calendas Plus';
  src: url('https://fonts.cdnfonts.com/s/16244/Calendas_Plus.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

.pdf-site-content {
  padding-top: 1rem;
  padding-bottom: 1rem;
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
  font-family: 'Calendas Plus', 'Montserrat', 'Arial', sans-serif;
  font-weight: 600;
  letter-spacing: 1.5px;
  color: #ffb300;
  background: none;
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
  width: 100vw;
  height: 100vh;
  background: #222;
  position: relative;
  z-index: 100;
  overflow: hidden; /* Cambiado de auto a hidden para evitar scroll */
  display: flex;
  justify-content: center;
  align-items: center; /* Cambiado de flex-start a center para centrar verticalmente */
}

.flipbook-root {
  margin: 0 auto;
  box-shadow: 0 2px 16px #0006;
  background: #fff;
  border-radius: 8px;
  max-width: 100vw;
  max-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
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
</style>