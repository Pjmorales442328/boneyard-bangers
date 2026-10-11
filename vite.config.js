import { defineConfig } from 'vite';

// RUN.world serves games from a sub-path, so asset URLs must be relative.
export default defineConfig({ base: './' });
