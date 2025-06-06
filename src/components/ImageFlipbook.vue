<template>
  <div class="pdf-site-content">
    <slot>
      <h1 class="pdf-title">Bienvenido a Pixel Ka'an</h1>
      <h2 class="pdf-title">ANIMACIÓN DIGITAL ESCÁRCEGA</h2>
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
.pdf-site-content {
  padding-top: 2rem;
  padding-bottom: 2rem;
  background: #f9f9f9;
  text-align: center;
}

.pdf-title {
  color: #2563eb;
  margin-top: 2rem;
  text-align: center;
}

.pdf-desc {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 2rem auto;
  color: #333;
  font-size: 1.2rem;
}

.image-flipbook-container {
  width: 100vw;
  height: 100vh;
  background: #222;
  position: relative;
  z-index: 100;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.flipbook-root {
  margin: 2rem auto;
  box-shadow: 0 2px 16px #0006;
  background: #fff;
  border-radius: 8px;
}
</style>