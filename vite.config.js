import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ghPages } from 'vite-plugin-gh-pages';
import tailwindcss from '@tailwindcss/vite';
// https://vite.dev/config/
export default defineConfig({
    base: '/dlm-demo/',
    plugins: [react(), tailwindcss(), ghPages()],
    publicDir: 'src/assets',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true,
        sourcemap: true,
        rollupOptions: {
            output: {
                assetFileNames: 'assets/[name][extname]'
            }
        }
    }
});
