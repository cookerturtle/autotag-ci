import { Plugin } from './types.js';

// For MVP we hard-code the one bundled plugin.
// Dynamic `import()` keeps core decoupled.
export async function discoverPlugins(): Promise<Plugin[]> {
  const { default: reactPlugin } = await import(
    /* webpackIgnore: true */ '../../plugin-react/src/index.js'
  );
  return [reactPlugin as Plugin];
}
