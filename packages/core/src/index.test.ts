import { describe, it, expect } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import fg from 'fast-glob';

import { InjectOptions } from './types'
import { inject } from './index';

/* -------------------------------------------------------------- *
 * Helpers                                                        *
 * -------------------------------------------------------------- */

async function makeBuildDir(): Promise<string> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'autotag-ci-'));

  await fs.writeFile(path.join(dir, 'asset-manifest.json'), '{}');
  await fs.writeFile(
    path.join(dir, 'index.html'),
    '<html><head><title>Home</title></head><body></body></html>',
  );
  await fs.writeFile(
    path.join(dir, 'about.html'),
    '<html><head><title>About</title></head><body></body></html>',
  );

  return dir;
}

/* -------------------------------------------------------------- *
 * Test-only in-memory plugin                                     *
 * -------------------------------------------------------------- */

function makeFakePlugin(detectResult: boolean) {
  return {
    async detect() {
      return detectResult;
    },
    async inject(opts: InjectOptions) {
      if (opts.dryRun) return;

      const files = await fg('**/*.html', { cwd: opts.buildDir, absolute: true });
      for (const file of files) {
        const original = await fs.readFile(file, 'utf8');
        const updated = original.replace(
          /<\/head>/i,
          `  <script src="${opts.snippetPath}"></script>\n</head>`,
        );
        await fs.writeFile(file, updated, 'utf8');
      }
    },
  };
}

/* -------------------------------------------------------------- *
 * Tests                                                          *
 * -------------------------------------------------------------- */

describe('core.inject', () => {
  it('inserts the snippet before </head> in every HTML file', async () => {
    const buildDir = await makeBuildDir();
    const snippet = path.join(buildDir, 'tag.js');
    await fs.writeFile(snippet, 'console.log("tag");');

    await inject({
      buildDir,
      snippetPath: snippet,
      plugins: [makeFakePlugin(true)],
    });

    const html = await fs.readFile(path.join(buildDir, 'index.html'), 'utf8');
    expect(html).toMatch(`<script src="${snippet}"></script>`);

    const html2 = await fs.readFile(path.join(buildDir, 'about.html'), 'utf8');
    expect(html2).toMatch(`<script src="${snippet}"></script>`);
  });

  it('leaves files untouched when dryRun=true', async () => {
    const buildDir = await makeBuildDir();
    const snippet = path.join(buildDir, 'tag.js');
    await fs.writeFile(snippet, '');

    const before = await fs.readFile(path.join(buildDir, 'index.html'), 'utf8');
    await inject({
      buildDir,
      snippetPath: snippet,
      dryRun: true,
      plugins: [makeFakePlugin(true)],
    });
    const after = await fs.readFile(path.join(buildDir, 'index.html'), 'utf8');

    expect(after).toBe(before);
  });

  it('throws NoPluginFoundError when no plugin detects the build', async () => {
    const buildDir = await fs.mkdtemp(path.join(os.tmpdir(), 'autotag-ci-'));
    const snippet = path.join(buildDir, 'tag.js');
    await fs.writeFile(snippet, '');

    await expect(
      inject({
        buildDir,
        snippetPath: snippet,
        plugins: [makeFakePlugin(false)],
      }),
    ).rejects.toMatchObject({ name: 'NoPluginFoundError' });
  });
});
