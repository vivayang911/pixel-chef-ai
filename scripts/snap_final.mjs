import { resolve } from 'path'
import { mkdirSync, writeFileSync, appendFileSync } from 'fs'
import { chromium } from 'playwright'

const DIR = resolve(import.meta.dirname, '..', 'docs', 'screenshots')
const LOG = resolve(import.meta.dirname, 'snap_final.log')
const BASE = 'http://localhost:4173'

mkdirSync(DIR, { recursive: true })
writeFileSync(LOG, '=== ' + new Date().toISOString() + ' ===\n')
const L = (m) => { console.log(m); appendFileSync(LOG, m + '\n') }

const b = await chromium.launch({ headless: true })
const p = await (await b.newContext({ viewport: { width: 1280, height: 720 } })).newPage()
p.on('pageerror', (err) => L('ERR: ' + err.message))

const snap = async (n, d = 800) => { await p.waitForTimeout(d); await p.screenshot({ path: resolve(DIR, n) }); L(' ✅ ' + n) }
const B = async (t, ms = 5000) => { try { const l = p.locator('button:has-text("' + t + '")').first(); await l.waitFor({ state: 'visible', timeout: ms }); await l.click(); L(' > ' + t); return true } catch { L(' x ' + t); return false } }

L('init...')
await p.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 15000 })
await p.evaluate(() => { localStorage.setItem('pixel-chef-lang','en'); localStorage.setItem('pixel-chef-tutorial-seen','1') })
await p.reload({ waitUntil: 'networkidle' })
await p.waitForTimeout(2500)

try {
  // 1-2 hero + home
  L('1/6 hero')
  await snap('hero.png', 1200)
  L('2/6 home')
  await snap('home.png')

  // 3 studio - click START COOKING, select ingredients, capture AI analysis
  L('3/6 studio')
  const sb = p.locator('button:has-text("START COOKING")')
  if (await sb.count() > 1) await sb.nth(1).click()
  else await sb.first().click()
  await p.waitForTimeout(3000)
  let sel = 0
  for (let i = 0; i < 50 && sel < 5; i++) {
    try { const t = (await p.locator('button').nth(i).textContent()) || ''; if (/^[🥬🥩🥚🍅🧄🧅🫘🥕🌿🍚🍜🥦]/.test(t)) { await p.locator('button').nth(i).click(); await p.waitForTimeout(350); sel++ } } catch {}
  }
  L('  sel:' + sel)
  await p.waitForTimeout(2000)
  await snap('studio.png', 1500)

  // 4 cooking - navigate via hash to #story
  L('4/6 cooking (#story)')
  await p.evaluate(() => { window.location.hash = 'story' })
  await p.waitForTimeout(5000)
  await snap('cooking.png')

  // 5 result - navigate via hash to #result
  L('5/6 result (#result)')
  await p.evaluate(() => { window.location.hash = 'result' })
  await p.waitForTimeout(4000)
  await snap('result.png')

  // 6 memory - navigate via hash to #memory
  L('6/6 memory (#memory)')
  await p.evaluate(() => { window.location.hash = 'memory' })
  await p.waitForTimeout(4000)
  await snap('memory.png')

  L('DONE!')
} catch (e) { L('FATAL: ' + e.message + '\n' + e.stack) }
finally { await b.close() }
