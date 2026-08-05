import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function removeModuleAttributePlugin() {
  return {
    name: 'remove-module-attribute',
    enforce: 'post',
    transformIndexHtml(html) {
      // Add no-cache meta tags to index.html
      let cleanHtml = html;
      if (!cleanHtml.includes('http-equiv="Cache-Control"')) {
        const metaNoCache = `<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />\n  <meta http-equiv="Pragma" content="no-cache" />\n  <meta http-equiv="Expires" content="0" />\n  `;
        cleanHtml = cleanHtml.replace('<head>', '<head>\n  ' + metaNoCache);
      }

      // Remove type="module" and crossorigin, and move script tag to bottom of body so #root exists
      cleanHtml = cleanHtml
        .replace(/type="module"/gi, '')
        .replace(/crossorigin="[^"]*"/gi, '')
        .replace(/crossorigin/gi, '');

      // Extract script tag and place it before </body>
      const scriptTagMatch = cleanHtml.match(/<script\s+src="\.\/assets\/[^\"]+\.js"><\/script>/i);
      if (scriptTagMatch) {
        cleanHtml = cleanHtml.replace(scriptTagMatch[0], '');
        cleanHtml = cleanHtml.replace('</body>', '  ' + scriptTagMatch[0] + '\n  </body>');
      } else {
        cleanHtml = cleanHtml.replace('<script', '<script defer');
      }

      return cleanHtml;
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), removeModuleAttributePlugin()],
  build: {
    target: 'es2015',
    modulePreload: false,
    rollupOptions: {
      output: {
        format: 'iife',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
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
