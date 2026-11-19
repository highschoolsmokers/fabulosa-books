import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { TUTORIAL_MD, tutorialFiles } from '../scripts/snippets'

// The tutorial's code comes from this app, in both the HTML pages and
// tutorial.md. If either changes without the other, this test fails.
// Fix it with `npm run snippets`.
const files = await tutorialFiles()

describe('tutorial code blocks', () => {
  it('finds the HTML pages and the Markdown copy', () => {
    expect(files.length).toBeGreaterThan(1)
    expect(files.map((f) => f.file)).toContain(TUTORIAL_MD)
  })

  for (const { file, render } of files) {
    it(`${path.basename(file)} matches the app source`, async () => {
      const text = await readFile(file, 'utf8')
      const { html: expected } = await render(text)
      expect(text).toBe(expected)
    })
  }

  it('sources every TypeScript, TSX, and SQL block it shows', async () => {
    const unsourced: string[] = []
    for (const { file } of files) {
      const text = await readFile(file, 'utf8')
      const blocks =
        file === TUTORIAL_MD
          ? text.matchAll(/(?<!-->)\n```(ts|tsx|sql)\n/g)
          : text.matchAll(/<pre><code(?![^>]*data-source)[^>]*class="language-(ts|tsx|sql)"[^>]*>/g)
      for (const [block] of blocks) unsourced.push(`${path.basename(file)}: ${block.trim()}`)
    }
    expect(unsourced).toEqual([])
  })
})
