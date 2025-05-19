/**
 * Public errors shared between @autotag-ci/core and all plugins.
 */

export class NoPluginFoundError extends Error {
  constructor(dir: string) {
    super(`No plugin claims responsibility for build dir: ${dir}`);
    this.name = 'NoPluginFoundError';
  }
}
export class InvalidSnippetError extends Error {
  constructor(path: string) {
    super(`Snippet file not found or not readable: ${path}`);
    this.name = 'InvalidSnippetError';
  }
}
