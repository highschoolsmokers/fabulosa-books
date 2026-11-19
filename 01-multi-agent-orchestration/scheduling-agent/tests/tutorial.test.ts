import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { render, tutorialPages } from '../scripts/snippets'

// The tutorial's code comes from this app. If either changes without the
// other, this test fails. Fix it with `npm run snippets`.
const pages = await tutorialPages()

describe('tutorial code blocks', () => {
  it('finds the tutorial pages', () => {
    expect(pages.length).toBeGreaterThan(0)
  })

  for (const page of pages) {
    it(`${path.basename(page)} matches the app source`, async () => {
      const html = await readFile(page, 'utf8')
      const { html: expected } = await render(html)
      expect(html).toBe(expected)
    })
  }

  it('sources every code block it shows from the app', async () => {
    const unsourced: string[] = []
    for (const page of pages) {
      const html = await readFile(page, 'utf8')
      for (const [block] of html.matchAll(/<pre><code(?![^>]*data-source)[^>]*class="language-(ts|tsx|sql)"[^>]*>/g)) {
        unsourced.push(`${path.basename(page)}: ${block}`)
      }
    }
    expect(unsourced).toEqual([])
  })
})
