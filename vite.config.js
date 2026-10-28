import { cpSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const root = process.cwd();

function copyProductionFiles() {
  return {
    name: 'copy-production-files',
    closeBundle() {
      for (const directory of ['icons', 'images/gallery']) {
        cpSync(
          resolve(root, 'assets', directory),
          resolve(root, 'build/assets', directory),
          { recursive: true, force: true },
        );
      }

      for (const file of ['robots.txt', 'sitemap.xml']) {
        cpSync(resolve(root, file), resolve(root, 'build', file));
      }
    },
  };
}

export default defineConfig({
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        index: resolve(root, 'index.html'),
        biografia: resolve(root, 'biografia.html'),
        eventos: resolve(root, 'eventos.html'),
        galeria: resolve(root, 'galeria.html'),
        admin: resolve(root, 'admin.html'),
      },
    },
  },
  plugins: [copyProductionFiles()],
});
