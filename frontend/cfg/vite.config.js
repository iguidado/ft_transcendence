import { defineConfig } from 'vite';

export default defineConfig({
	root: './src',  // Vite will serve the files from the src folder
	server: {
		watch: {
			usePolling: true, // Enable polling for file changes
		},
		host: '0.0.0.0', // Bind to all network interface (needed for docker)
		port: 3000,  // Development server will run on port 3000
		hot: true,  // Enable hot module replacement (HMR)
		fs: {
			strict: true, // Allow serving files outside the root
		},
		middlewareMode: false, // Default mode
		historyApiFallback: true, // Redirect all requests to index.html
	},
	build: {
		rollupOptions: {
			input: './src/index.html', // Reference only src/index.html
		},
	},
});
