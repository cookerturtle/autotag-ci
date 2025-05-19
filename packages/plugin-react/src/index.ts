import fg from 'fast-glob';
import { promises as fs } from 'fs';
import path from 'path';
import { parseDocument, DomUtils } from 'htmlparser2';
import { Element } from 'domhandler';
import render from 'dom-serializer';

/* ------------------------------------------------------------------ *
 * Types                                                               *
 * ------------------------------------------------------------------ */

export interface InjectOptions {
  buildDir: string;
  snippetPath: string;
  dryRun?: boolean;
  outDir?: string;
}

/* ------------------------------------------------------------------ *
 * detect()                                                            *
 * ------------------------------------------------------------------ */

async function detect(buildDir: string): Promise<boolean> {
  try {
    await fs.access(path.join(buildDir, 'asset-manifest.json'));
    return true;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ *
 * inject()                                                            *
 * ------------------------------------------------------------------ */

async function inject(opts: InjectOptions): Promise<void> {
  const buildDir = path.resolve(opts.buildDir);
  const outDir   = opts.outDir ? path.resolve(opts.outDir) : null;
  const snippet  = path.resolve(opts.snippetPath);

  const htmlFiles = await fg('**/*.html', { cwd: buildDir, absolute: true });

  /* insure copy-to directory if requested */
  if (outDir && !opts.dryRun) {
    await fs.mkdir(outDir, { recursive: true });
  }

  for (const file of htmlFiles) {
    const raw = await fs.readFile(file, 'utf8');

    /* parse → mutate DOM */
    const dom     = parseDocument(raw);
    const headTag = DomUtils.findOne(
      (el) => el.type === 'tag' && (el as Element).name === 'head',
      dom.children,
      true,
    ) as Element | null;

    if (!headTag) continue; // weird – skip

    const scriptEl: Element = new Element('script', { src: snippet });
    headTag.children.push(scriptEl); // append = right before </head>

    /* serialise back to HTML */
    const updated = render(dom, { encodeEntities: false });

    if (opts.dryRun) continue;

    const targetPath =
      outDir
        ? path.join(outDir, path.relative(buildDir, file))
        : file;

    if (outDir) {
      await fs.mkdir(path.dirname(targetPath), { recursive: true });
    }

    await fs.writeFile(targetPath, updated, 'utf8');
  }
}

export default { detect, inject };