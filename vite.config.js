import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import tailwindcss from "tailwindcss";
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  // define: {
  //   "process.env": {
  //     NODE_DEBUG: process.env.NODE_DEBUG || "", // Define other environment variables as needed
  //   },
  //   global: {}, // Add this line
  // },
  // resolve: {
  //   alias: {
  //     util: "util/",
  //     'stream': 'stream-browserify',
  //     'buffer': 'buffer/',
  //     // 'util': 'util/',
  //     // Add any other aliases you may need
  //   },
  // },
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks: {
  //         biconomy: ['@biconomy/mexa'], // Split Biconomy into its own chunk
  //       },
  //     },
  //   },
  // },
});
