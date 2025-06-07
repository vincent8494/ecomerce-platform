import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        chunkSizeWarningLimit: 1000, // Increase chunk size warning limit to 1000 kB
        rollupOptions: {
            output: {
                manualChunks: {
                    // Split vendor libraries into separate chunks
                    react: ['react', 'react-dom', 'react-router-dom'],
                    // Split state management
                    state: ['@reduxjs/toolkit', 'react-redux'],
                    // Split utility libraries
                    utils: ['axios', 'date-fns'],
                    // Split i18n
                    i18n: ['i18next', 'react-i18next'],
                    // Split UI libraries
                    ui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
                },
            },
        },
    },
    // Enable source maps in development
    esbuild: {
        drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
});
