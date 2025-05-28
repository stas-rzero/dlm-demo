import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ghPages } from 'vite-plugin-gh-pages';
// https://vite.dev/config/
export default defineConfig({
    base: '/dlm-demo/',
    plugins: [react(), ghPages()],
    css: {
        postcss: './postcss.config.js',
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true,
        sourcemap: true
    }
});
