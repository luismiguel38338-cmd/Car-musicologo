import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

function streamProxyPlugin(): Plugin {
  return {
    name: 'stream-proxy',
    configureServer(server) {
      server.middlewares.use('/api/stream', async (req, res) => {
        const urlObj = new URL(req.url || '', 'http://localhost:3000');
        const targetUrl = urlObj.searchParams.get('url');
        if (!targetUrl) {
          res.statusCode = 400;
          return res.end('Missing url parameter');
        }
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
        if (req.method === 'OPTIONS') {
          return res.end();
        }
        try {
          const upstream = await fetch(targetUrl);
          res.setHeader('Content-Type', upstream.headers.get('content-type') || 'audio/mpeg');
          if (upstream.body) {
            const reader = upstream.body.getReader();
            req.on('close', () => {
              reader.cancel().catch(() => {});
            });
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              res.write(value);
            }
          }
          res.end();
        } catch (e: any) {
          res.statusCode = 502;
          res.end(e?.message || 'Proxy error');
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      streamProxyPlugin(),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.png', 'apple-touch-icon.png', 'icon.svg'],
        manifest: {
          id: '/',
          name: 'Luis Miguel Musicólogo · Pioneer Car Audio',
          short_name: 'Luis Miguel',
          description: 'Simulador interactivo de car audio Pioneer DEH-4250BT de Luis Miguel Musicólogo con chucheros animados, kitipos, ecualizadores y DJ Soundboard.',
          theme_color: '#ff2d2d',
          background_color: '#000000',
          display: 'standalone',
          orientation: 'any',
          start_url: '/',
          scope: '/',
          categories: ['music', 'entertainment'],
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
