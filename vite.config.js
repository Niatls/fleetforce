import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Custom plugin to remove type="module" and crossorigin attributes from built index.html
// so that double-clicking file:///.../index.html on local disk works 100% in Chrome/Edge without CORS errors.
function removeModuleTypePlugin() {
  return {
    name: 'remove-module-type',
    enforce: 'post',
    transformIndexHtml(html) {
      return html
        .replace(/type="module"/gi, '')
        .replace(/crossorigin="[^"]*"/gi, '')
        .replace(/crossorigin/gi, '');
    }
  };
}

export default defineConfig({
  plugins: [react(), viteSingleFile(), removeModuleTypePlugin()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
