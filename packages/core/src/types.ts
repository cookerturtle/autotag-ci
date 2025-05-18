/**
 * Public types shared between @autotag-ci/core and all plugins.
 */

export interface InjectOptions {
  buildDir: string;           // absolute or relative path to the framework’s build output
  snippetPath: string;        // path (or URL) to the tracking script to insert
  outDir?: string;            // if provided, write mutated HTML here instead of in-place
  dryRun?: boolean;           // when true, just report would-be changes
}

export interface Plugin {
  /** Return true if this plugin can handle the given build directory */
  detect(buildDir: string): Promise<boolean> | boolean;

  /** Perform the actual HTML mutation / copy work */
  inject(opts: InjectOptions): Promise<void>;
}
