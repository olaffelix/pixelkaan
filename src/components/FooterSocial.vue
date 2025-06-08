<template>
  <footer class="footer-social">
    <a href="https://facebook.com/" target="_blank" rel="noopener" aria-label="Facebook" class="footer-icon">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="currentColor"><path d="M29 0h-26c-1.7 0-3 1.3-3 3v26c0 1.7 1.3 3 3 3h13v-12h-4v-5h4v-4c0-3.3 2.7-6 6-6h4v5h-4c-0.6 0-1 0.4-1 1v4h5l-1 5h-4v12h7c1.7 0 3-1.3 3-3v-26c0-1.7-1.3-3-3-3z"/></svg>
    </a>
    <a href="https://twitter.com/" target="_blank" rel="noopener" aria-label="Twitter" class="footer-icon">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="currentColor"><path d="M32 6.1a13 13 0 0 1-3.8 1.1 6.6 6.6 0 0 0 2.9-3.6 13.1 13.1 0 0 1-4.2 1.6 6.6 6.6 0 0 0-11.2 6c-5.5-0.3-10.3-2.9-13.5-6.8a6.6 6.6 0 0 0 2 8.8 6.6 6.6 0 0 1-3-0.8v0.1a6.6 6.6 0 0 0 5.3 6.5 6.6 6.6 0 0 1-3 0.1 6.6 6.6 0 0 0 6.1 4.5 13.2 13.2 0 0 1-8.2 2.8c-0.5 0-1 0-1.5-0.1a18.6 18.6 0 0 0 10.1 3c12.1 0 18.7-10 18.7-18.7 0-0.3 0-0.5 0-0.8a13.3 13.3 0 0 0 3.3-3.4z"/></svg>
    </a>
    <a href="https://wa.me/5210000000000" target="_blank" rel="noopener" aria-label="WhatsApp" class="footer-icon">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="currentColor"><path d="M16 3c-7.2 0-13 5.8-13 13 0 2.3 0.6 4.5 1.7 6.5l-1.8 6.5 6.7-1.8c1.9 1 4.1 1.6 6.4 1.6 7.2 0 13-5.8 13-13s-5.8-13-13-13zM16 27c-2.1 0-4.1-0.5-5.9-1.5l-0.4-0.2-4 1.1 1.1-3.9-0.2-0.4c-1-1.7-1.6-3.7-1.6-5.8 0-6.1 4.9-11 11-11s11 4.9 11 11-4.9 11-11 11zM23.5 20.2c-0.3-0.2-1.7-0.8-2-0.9-0.3-0.1-0.5-0.2-0.7 0.2s-0.8 0.9-1 1.1c-0.2 0.2-0.4 0.2-0.7 0.1-0.3-0.2-1.3-0.5-2.5-1.5-0.9-0.8-1.5-1.7-1.7-2-0.2-0.3 0-0.5 0.1-0.7 0.1-0.1 0.2-0.3 0.3-0.4 0.1-0.1 0.1-0.2 0.2-0.3 0.1-0.1 0-0.3 0-0.4s-0.7-1.7-1-2.3c-0.3-0.6-0.6-0.5-0.7-0.5-0.2 0-0.3 0-0.5 0-0.2 0-0.4 0-0.6 0.2-0.2 0.2-0.8 0.8-0.8 2s0.8 2.3 0.9 2.5c0.1 0.2 1.6 2.5 4 3.4 0.6 0.2 1.1 0.3 1.5 0.3 0.5 0 0.9-0.1 1.2-0.2 0.4-0.1 1.2-0.5 1.3-1.1 0.2-0.6 0.2-1.1 0.1-1.2z"/></svg>
    </a>
    <a href="mailto:info@pixelkaan.com" target="_blank" rel="noopener" aria-label="Email" class="footer-icon">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="currentColor"><path d="M28 4h-24c-2.2 0-4 1.8-4 4v16c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4v-16c0-2.2-1.8-4-4-4zM28 8v0.5l-12 7.5-12-7.5v-0.5h24zM4 24v-12.2l11.4 7.1c0.2 0.1 0.4 0.1 0.6 0l11.4-7.1v12.2h-24z"/></svg>
    </a>
  </footer>
</template>

<style scoped>
.footer-social {
  width: 98vw;
  background: #181818;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  padding: 1.2rem 0 0.5rem 0;
  font-size: 1.1rem;
  border-top: 2px solid #333a;
  margin-top: 0.5rem;
}

.footer-icon {
  color: #fff;
  transition: color 0.2s, transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-icon:hover {
  color: #3c8cff;
  transform: scale(1.18) rotate(-6deg);
}
</style>
