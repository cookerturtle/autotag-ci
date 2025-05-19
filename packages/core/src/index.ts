import { InjectOptions, Plugin, PluginModule } from './types'
import { NoPluginFoundError, InvalidSnippetError } from './errors';

import { promises as fs } from 'fs';
import path from 'path';

/* ------------------------------------------------------------------ *
 * Private helpers                                                    *
 * ------------------------------------------------------------------ */

const PLUGIN_SPECIFIERS = [
  // TEMP: one hard-coded plugin for the MVP
  new URL('../../plugin-react/src/index.js', import.meta.url).pathname,
];

async function ensureSnippetExists(file: string): Promise<void> {
  try {
    await fs.access(file);
  } catch {
    throw new InvalidSnippetError(`Snippet file not found or unreadable: ${file}`);
  }
}

async function loadPlugins(): Promise<Plugin[]> {
  const plugins: Plugin[] = [];

  for (const spec of PLUGIN_SPECIFIERS) {
    try {
      // dynamic import supports both CJS & ESM default/ named exports
      const mod: PluginModule = await import(spec);
      const candidate = mod?.default ? mod.default : mod;

      if (typeof candidate.detect === 'function' && typeof candidate.inject === 'function') {
        plugins.push(candidate as Plugin);
      }
    } catch {
      // TEMP: file does not exist or is unreadable
      break;
    }
  }

  return plugins;
}

/* ------------------------------------------------------------------ *
 * Public API                                                         *
 * ------------------------------------------------------------------ */

export interface InjectRuntimeOptions extends InjectOptions {
  /**
   *  Optional explicit plugin list.  When provided, `inject()` uses this
   *  array instead of calling `loadPlugins()`.  This is intended for
   *  tests.
   */
  plugins?: Plugin[];
}

/**
 * Selects the first plugin that claims `buildDir` and delegates the
 * real work to it.  Throws when no plugin matches or the snippet path
 * is invalid.
 */
export async function inject(options: InjectRuntimeOptions): Promise<void> {
  const opts: InjectRuntimeOptions = {
    ...options,
    buildDir: path.resolve(options.buildDir),
    snippetPath: path.resolve(options.snippetPath),
  };

  await ensureSnippetExists(opts.snippetPath);

  const plugins = opts.plugins ?? await loadPlugins();

  for (const plugin of plugins) {
    if (await plugin.detect(opts.buildDir)) {
      await plugin.inject(opts);
      return;
    }
  }

  throw new NoPluginFoundError(
    `Unable to find a plugin that recognises the build at “${opts.buildDir}”.`,
  );
}

export default { inject };