<template>
  <div>
    <div class="pdf-site-content">
      <slot>
        <h1 class="pdf-title">Bienvenido a Pixel Ka'an</h1>
        <h2 class="pdf-title">ANIMACIÓN DIGITAL ESCÁRCEGA</h2>
        <p class="pdf-desc">
          La revista que traza la cultura escarceguense.
        </p>
      </slot>
    </div>
    <div id="pdf-viewer-container">
      <iframe :src="pdfUrl" width="100%" height="100%" class="pdf-iframe"></iframe>
    </div>
  </div>
</template>

<script setup>
const pdfUrl = '/file.pdf';
</script>

<style scoped>
.pdf-site-content {
  padding-top: 2rem;
  padding-bottom: 0rem;
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
#pdf-viewer-container {
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
.pdf-iframe {
  border: none;
}
</style>
