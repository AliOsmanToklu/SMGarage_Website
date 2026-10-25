import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' → derlenen site herhangi bir klasöre/hostinge doğrudan yüklenebilir
export default defineConfig({
  plugins: [react()],
  base: './',
});
