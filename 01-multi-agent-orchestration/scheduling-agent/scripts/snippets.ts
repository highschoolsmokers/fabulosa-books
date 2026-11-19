// Keep the tutorial's code blocks identical to this app's source.
//
// A block in the tutorial HTML names its source:
//   <pre><code class="language-ts" data-source="lib/rules.ts#validate"></code></pre>
// `#validate` selects the lines between `// #region validate` and
// `// #endregion validate` (or `-- #region` in SQL). No `#` means the whole file.
//
//   node scripts/snippets.ts          rewrite the blocks from source
//   node scripts/snippets.ts --check  exit 1 if any block is out of date
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const TUTORIAL_DIR = path.resolve(APP_ROOT, '../../html')

const BLOCK = /<code([^>]*?)\sdata-source="([^"]+)"([^>]*)>([\s\S]*?)<\/code>/g
const MARKER = /^\s*(\/\/|--|\{\/\*)\s*#(end)?region\b/

function escapeHtml(text: string): string {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function dedent(lines: string[]): string[] {
  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^ */)?.[0].length ?? 0)
  const min = Math.min(...indents, Number.POSITIVE_INFINITY)
  return lines.map((l) => l.slice(Number.isFinite(min) ? min : 0))
}

export async function extract(source: string): Promise<string> {
  const [file, region] = source.split('#')
  const text = await readFile(path.join(APP_ROOT, file), 'utf8')
  let lines = text.replace(/\n$/, '').split('\n')

  if (region) {
    const start = lines.findIndex((l) => new RegExp(`#region ${region}\\s*$`).test(l))
    const end = lines.findIndex((l, i) => i > start && new RegExp(`#endregion ${region}\\s*$`).test(l))
    if (start === -1 || end === -1) throw new Error(`No region "${region}" in ${file}`)
    lines = lines.slice(start + 1, end)
  }
  return dedent(lines.filter((l) => !MARKER.test(l))).join('\n')
}

export async function tutorialPages(): Promise<string[]> {
  const files = await readdir(TUTORIAL_DIR)
  return files.filter((f) => f.endsWith('.html')).map((f) => path.join(TUTORIAL_DIR, f))
}

// Returns the page with every sourced block filled in, plus the sources it used.
export async function render(html: string): Promise<{ html: string; sources: string[] }> {
  const sources: string[] = []
  const replacements = new Map<string, string>()
  for (const [, , source] of html.matchAll(BLOCK)) {
    sources.push(source)
    replacements.set(source, escapeHtml(await extract(source)))
  }
  const out = html.replace(
    BLOCK,
    (_m, before, source, after) => `<code${before} data-source="${source}"${after}>${replacements.get(source)}</code>`,
  )
  return { html: out, sources }
}

// The Markdown copy marks a sourced block with a comment on the line above:
//   <!-- source: lib/rules.ts#validate -->
//   ```ts
//   ...
//   ```
export const TUTORIAL_MD = path.resolve(APP_ROOT, '../tutorial.md')
const MD_BLOCK = /<!-- source: (\S+) -->\n```(\w*)\n[\s\S]*?\n```/g

export async function renderMarkdown(md: string): Promise<{ html: string; sources: string[] }> {
  const sources: string[] = []
  const code = new Map<string, string>()
  for (const [, source] of md.matchAll(MD_BLOCK)) {
    sources.push(source)
    code.set(source, await extract(source))
  }
  const out = md.replace(
    MD_BLOCK,
    (_m, source, lang) => `<!-- source: ${source} -->\n\`\`\`${lang}\n${code.get(source)}\n\`\`\``,
  )
  return { html: out, sources }
}

// Every file this script keeps in sync, with the renderer for its format.
export async function tutorialFiles() {
  const pages = (await tutorialPages()).map((file) => ({ file, render }))
  return [...pages, { file: TUTORIAL_MD, render: renderMarkdown }]
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const check = process.argv.includes('--check')
  let stale = 0
  for (const { file: page, render } of await tutorialFiles()) {
    const html = await readFile(page, 'utf8')
    const { html: next, sources } = await render(html)
    if (next === html) continue
    stale++
    if (check) {
      console.error(`${path.basename(page)} is out of date (${sources.length} sourced blocks).`)
    } else {
      await writeFile(page, next)
      console.log(`Updated ${path.basename(page)} (${sources.length} blocks).`)
    }
  }
  if (check && stale > 0) {
    console.error('Run `npm run snippets` to update the tutorial.')
    process.exit(1)
  }
}
