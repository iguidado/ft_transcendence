// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  root: './src',  // Vite will serve the files from the src folder
  server: {
    host: '0.0.0.0', // Bind to all network interface (needed for docker)
    port: 3000,  // Development server will run on port 3000
    hot: true,  // Enable hot module replacement (HMR)
  },
});
