// packages/core/src/errors.ts
var NoPluginFoundError = class extends Error {
  constructor(dir) {
    super(`No plugin claims responsibility for build dir: ${dir}`);
    this.name = "NoPluginFoundError";
  }
};
var InvalidSnippetError = class extends Error {
  constructor(path2) {
    super(`Snippet file not found or not readable: ${path2}`);
    this.name = "InvalidSnippetError";
  }
};

// packages/core/src/index.ts
import { promises as fs } from "fs";
import path from "path";
var PLUGIN_SPECIFIERS = [
  // TEMP: one hard-coded plugin for the MVP
  new URL("../../plugin-react/src/index.js", import.meta.url).pathname
];
async function ensureSnippetExists(file) {
  try {
    await fs.access(file);
  } catch {
    throw new InvalidSnippetError(`Snippet file not found or unreadable: ${file}`);
  }
}
async function loadPlugins() {
  const plugins = [];
  for (const spec of PLUGIN_SPECIFIERS) {
    try {
      const mod = await import(spec);
      const candidate = mod?.default ? mod.default : mod;
      if (typeof candidate.detect === "function" && typeof candidate.inject === "function") {
        plugins.push(candidate);
      }
    } catch {
      break;
    }
  }
  return plugins;
}
async function inject(options) {
  const opts = {
    ...options,
    buildDir: path.resolve(options.buildDir),
    snippetPath: path.resolve(options.snippetPath)
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
    `Unable to find a plugin that recognises the build at \u201C${opts.buildDir}\u201D.`
  );
}
var src_default = { inject };
export {
  src_default as default,
  inject
};
//# sourceMappingURL=index.js.map
