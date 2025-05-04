import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig(() => {

  return {
    plugins: [
      react(),
      basicSsl(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: true,
        },
        manifest: {
          name: 'PWA-WMS-prototype',
          short_name: 'PWA-WMS',
          description: 'A PWA WMS prototype',
          theme_color: '#1976d2',
          icons: [
            {
              src: '/AppImages/android/android-launchericon-192-192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/AppImages/android/android-launchericon-512-512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          runtimeCaching: [{
            urlPattern: ({ url }) => {
              return url.pathname.startsWith("/");
            },
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
              networkTimeoutSeconds: 5,
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
          {
            urlPattern: /\.wasm$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'wasm-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          ],
        },
      }),
    ],
    server: {
      // https: isProduction,
      host: true,
      https: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    // tests not done yet
    // test: {
    //   environment: 'jsdom',
    //   globals: true,
    //   setupFiles: './testSetup.js',
    // },
  };
});