/**
 * Genera iconos del launcher de Android en todos los tamaños necesarios.
 * Uso: npx tsx scripts/gen-android-icons.ts
 */
import { chromium } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const svgPath = path.resolve(__dirname, '../public/favicon.svg')
const androidRes = path.resolve(__dirname, '../android/app/src/main/res')

const svg = fs.readFileSync(svgPath, 'utf8')

const SIZES = [
  { dir: 'mipmap-mdpi',    size: 48,  round: 48  },
  { dir: 'mipmap-hdpi',    size: 72,  round: 72  },
  { dir: 'mipmap-xhdpi',   size: 96,  round: 96  },
  { dir: 'mipmap-xxhdpi',  size: 144, round: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192, round: 192 },
]

const html = (size: number, round: boolean) => `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    width: ${size}px; height: ${size}px;
    background: #0F0D0A;
    display: flex; align-items: center; justify-content: center;
    ${round ? `border-radius: ${size / 2}px; overflow: hidden;` : ''}
  }
  svg { width: ${Math.round(size * 0.68)}px; height: ${Math.round(size * 0.68)}px; }
</style>
</head>
<body>${svg}</body>
</html>`

async function main() {
  const browser = await chromium.launch()

  for (const { dir, size } of SIZES) {
    const page = await browser.newPage()
    const outDir = path.join(androidRes, dir)

    // ic_launcher (square)
    await page.setViewportSize({ width: size, height: size })
    await page.setContent(html(size, false), { waitUntil: 'networkidle' })
    await page.screenshot({ path: path.join(outDir, 'ic_launcher.png'), clip: { x: 0, y: 0, width: size, height: size } })

    // ic_launcher_round
    await page.setContent(html(size, true), { waitUntil: 'networkidle' })
    await page.screenshot({ path: path.join(outDir, 'ic_launcher_round.png'), clip: { x: 0, y: 0, width: size, height: size } })

    await page.close()
    console.log(`✓ ${dir} (${size}px)`)
  }

  await browser.close()
}

main()
