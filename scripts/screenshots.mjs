/**
 * Pixel Chef AI — Automated Screenshot Capture
 *
 * Takes 6 screenshots (1280×720) by navigating through the SPA flow.
 *
 * Usage:  npm run screenshots
 */

import { execSync, spawn } from 'child_process'
import { existsSync } from 'fs'
import { mkdir } from 'fs/promises'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DIST = resolve(ROOT, 'dist')
const SCREENSHOTS_DIR = resolve(ROOT, 'docs', 'screenshots')
const PORT = 4173
const BASE = `http://localhost:${PORT}`

/* ================================================================== */
/*  Ensure dist exists                                                 */
/* ================================================================== */

if (!existsSync(resolve(DIST, 'index.html'))) {
  console.log('🔨 Building...')
  execSync('npm run build', { cwd: ROOT, stdio: 'inherit' })
}

/* ================================================================== */
/*  Start vite preview                                                 */
/* ================================================================== */

const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--host', '0.0.0.0'], {
  cwd: ROOT,
  stdio: ['ignore', 'pipe', 'pipe'],
  shell: true,
})

let resolveReady, rejectReady
const serverReady = new Promise((res, rej) => {
  resolveReady = res
  rejectReady = rej
})
const timeout = setTimeout(() => rejectReady(new Error('Preview server did not start')), 20000)

let output = ''
preview.stdout.on('data', (d) => { output += d.toString(); process.stdout.write(d) })
preview.stderr.on('data', (d) => { output += d.toString() })
preview.on('error', rejectReady)

// Poll until server is ready
let attempts = 0
const poll = setInterval(async () => {
  attempts++
  try {
    const res = await fetch(`${BASE}/`)
    if (res.ok) {
      clearInterval(poll)
      clearTimeout(timeout)
      resolveReady()
    }
  } catch {
    if (attempts > 30) {
      clearInterval(poll)
      clearTimeout(timeout)
      rejectReady(new Error('Server never responded'))
    }
  }
}, 500)

/* ================================================================== */
/*  Main                                                               */
/* ================================================================== */

async function main() {
  await mkdir(SCREENSHOTS_DIR, { recursive: true })

  console.log('🚀 Waiting for preview server...')
  await serverReady
  console.log('✅ Preview server ready\n')

  const { chromium } = await import('playwright')
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } })
  const page = await ctx.newPage()

  const snap = async (name) => {
    await page.waitForTimeout(500)
    await page.screenshot({ path: resolve(SCREENSHOTS_DIR, name), fullPage: false })
    console.log(`  ✅ ${name}`)
  }

  const clickBtn = async (text) => {
    const btn = page.locator(`button:has-text("${text}")`).first()
    try {
      await btn.waitFor({ state: 'visible', timeout: 5000 })
      await btn.click()
      return true
    } catch { return false }
  }

  const waitForText = async (text) => {
    try {
      await page.locator(`:has-text("${text}")`).first().waitFor({ state: 'visible', timeout: 8000 })
      return true
    } catch { return false }
  }

  try {
    /* ============================ */
    /* 1️⃣ hero.png                 */
    /* ============================ */
    console.log('📷 1/6  hero.png  — Home page')
    await page.goto(BASE, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)
    await snap('hero.png')

    /* ============================ */
    /* 2️⃣ home.png                 */
    /* ============================ */
    console.log('📷 2/6  home.png  — Kitchen with fridge')
    // Try to hover over an interactive element to show fridge state
    const clickable = page.locator('.cursor-pointer, [class*="fridge"], [class*="ingredient"]').first()
    if (await clickable.isVisible().catch(() => false)) {
      await clickable.hover()
      await page.waitForTimeout(600)
    }
    await snap('home.png')

    /* ============================ */
    /* 3️⃣ studio.png               */
    /* ============================ */
    console.log('📷 3/6  studio.png — AI Cooking Studio')
    // Click START COOKING to enter studio
    await clickBtn('Start Cooking')
    await page.waitForTimeout(1500)
    // Try selecting some ingredients to show the AI panel
    const btnCount = await page.locator('button').count()
    let selected = 0
    for (let i = 0; i < btnCount && selected < 4; i++) {
      const btn = page.locator('button').nth(i)
      try {
        const txt = (await btn.textContent()) || ''
        // Skip navigation/action buttons, click ingredient buttons
        if (txt.match(/🥬|🥩|🥚|🍅|🧄|🧅|🫘|🥕|🌿|🍚|🍜|🥦/)) {
          await btn.click()
          await page.waitForTimeout(350)
          selected++
        }
      } catch { /* skip */ }
    }
    await page.waitForTimeout(1000)
    await snap('studio.png')

    /* ============================ */
    /* 4️⃣ cooking.png              */
    /* ============================ */
    console.log('📷 4/6  cooking.png — AI Cooking Simulation')
    // Click START COOKING (studio page button)
    await clickBtn('START COOKING')
    await page.waitForTimeout(800)

    // If cooking method selector appears, pick the first method
    if (await clickBtn('Stir-fry')) {
      await page.waitForTimeout(500)
      await clickBtn('START COOKING')
      await page.waitForTimeout(1500)
    }

    // If already on cooking page, click AUTO COOK
    if (await clickBtn('AUTO COOK WITH AI')) {
      await page.waitForTimeout(3000)
    }
    await snap('cooking.png')

    /* ============================ */
    /* 5️⃣ result.png               */
    /* ============================ */
    console.log('📷 5/6  result.png — Dish Reveal')
    // Wait for cooking to finish and result to appear
    await waitForText('COOKING COMPLETE')
    await page.waitForTimeout(2000)
    await snap('result.png')

    /* ============================ */
    /* 6️⃣ memory.png               */
    /* ============================ */
    console.log('📷 6/6  memory.png — Taste Memory')
    // Click MEMORY nav button
    if (await clickBtn('MEMORY')) {
      await page.waitForTimeout(1500)
    }
    await snap('memory.png')

    console.log('\n🎉 All 6 screenshots saved to docs/screenshots/\n')
  } catch (err) {
    console.error('❌ Error:', err.message)
  } finally {
    await browser.close()
    preview.kill()
  }
}

main()
