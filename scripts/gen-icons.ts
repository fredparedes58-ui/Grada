/**
 * Genera icon-192.png e icon-512.png desde favicon.svg usando Playwright.
 * Uso: npx tsx scripts/gen-icons.ts
 */
import { chromium } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const svgPath = path.resolve(__dirname, '../public/favicon.svg')
const outDir  = path.resolve(__dirname, '../public')

const SIZES = [192, 512]

const svg = fs.readFileSync(svgPath, 'utf8')
const html = (size: number) => `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: ${size}px; height: ${size}px; background: #050D1A; display: flex; align-items: center; justify-content: center; }
  svg { width: ${Math.round(size * 0.65)}px; height: ${Math.round(size * 0.65)}px; }
</style>
</head>
<body>${svg}</body>
</html>`

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  for (const size of SIZES) {
    await page.setViewportSize({ width: size, height: size })
    await page.setContent(html(size), { waitUntil: 'networkidle' })
    const out = path.join(outDir, `icon-${size}.png`)
    await page.screenshot({ path: out, clip: { x: 0, y: 0, width: size, height: size } })
    console.log(`✓ ${out}`)
  }

  await browser.close()
}

main()
