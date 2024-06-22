// vite.config.js
import { defineConfig } from 'vite'
import { resolve } from 'path'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [cssInjectedByJsPlugin(), react() ],
  build: {
    lib: {
      entry: resolve(__dirname, 'main.js'),
      name: 'WidgetSystem',
      fileName: (format) => `widget-system.${format}.js`
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css')
            return 'widget-system.css'
          return assetInfo.name
        }
      }
    }
  }
})


