#!/usr/bin/env node
// AutoTag-CI -- thin CLI wrapper around packages/core
import { inject } from './packages/core/dist/index.js';

(async () => {
  const [buildDir, snippetPath] = process.argv.slice(2);
  try {
    await inject({ buildDir, snippetPath });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
