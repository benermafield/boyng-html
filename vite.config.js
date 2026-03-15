import { defineConfig } from 'vite';

export default defineConfig({
    // Phaser is loaded from CDN in index.html and is not bundled by Vite.
    // The game source files reference it as a browser global (window.Phaser).
});
