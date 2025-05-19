import { describe, it, expect, beforeEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

import plugin from './index';
const { detect, inject } = plugin;

/* ---------------------------------------------------------------- *
 * Helpers                                                          *
 * ---------------------------------------------------------------- */

async function makeBuildDir(): Promise<string> {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'react-build-'));
  
    await fs.writeFile(path.join(dir, 'asset-manifest.json'), '{}');
    await fs.writeFile(
      path.join(dir, 'index.html'),
      '<html><head><title>X</title></head><body></body></html>',
    );
  
    await fs.mkdir(path.join(dir, 'sub'), { recursive: true });
    await fs.writeFile(
      path.join(dir, 'sub', 'page.html'),
      '<html><head><title>Y</title></head><body></body></html>'
    );
  
    return dir;
}

/* ---------------------------------------------------------------- *
 * Tests                                                             *
 * ---------------------------------------------------------------- */

describe('plugin-react', () => {
  let buildDir: string;
  let snippet: string;

  beforeEach(async () => {
    buildDir = await makeBuildDir();
    snippet  = path.join(buildDir, 'tag.js');
    await fs.writeFile(snippet, '');
  });

  it('detects a React-static build when asset-manifest.json exists', async () => {
    expect(await detect(buildDir)).toBe(true);
    expect(await detect(path.dirname(buildDir))).toBe(false);
  });

  it('injects <script> before </head> across all html files', async () => {
    await inject({ buildDir, snippetPath: snippet });

    const html1 = await fs.readFile(path.join(buildDir, 'index.html'), 'utf8');
    const html2 = await fs.readFile(path.join(buildDir, 'sub', 'page.html'), 'utf8');

    expect(html1).toMatch(`<script src="${snippet}"></script>`);
    expect(html2).toMatch(`<script src="${snippet}"></script>`);
  });

  it('respects dryRun (makes no changes)', async () => {
    const before = await fs.readFile(path.join(buildDir, 'index.html'), 'utf8');
    await inject({ buildDir, snippetPath: snippet, dryRun: true });
    const after  = await fs.readFile(path.join(buildDir, 'index.html'), 'utf8');

    expect(after).toBe(before);
  });

  it('writes to outDir when provided, leaving originals untouched', async () => {
    const outDir = path.join(os.tmpdir(), 'react-out');
    await inject({ buildDir, snippetPath: snippet, outDir });

    const original = await fs.readFile(path.join(buildDir, 'index.html'), 'utf8');
    expect(original).not.toMatch(`<script src="${snippet}"></script>`);

    const outFile = await fs.readFile(path.join(outDir, 'index.html'), 'utf8');
    expect(outFile).toMatch(`<script src="${snippet}"></script>`);
  });
});
