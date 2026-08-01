import { resolve } from 'path'
import { mkdirSync, writeFileSync, appendFileSync } from 'fs'
import { chromium } from 'playwright'

const DIR = resolve(import.meta.dirname, '..', 'docs', 'screenshots')
const LOG = resolve(import.meta.dirname, 'snap2.log')
mkdirSync(DIR, { recursive: true })

writeFileSync(LOG, '--- ' + new Date().toISOString() + ' ---\n')
const L = (m) => { console.log(m); appendFileSync(LOG, m + '\n') }

const b = await chromium.launch({ headless: true })
const p = await (await b.newContext({ viewport: { width: 1280, height: 720 } })).newPage()

p.on('pageerror', (err) => L('PAGE ERROR: ' + err.message))
p.on('crash', () => L('CRASH'))

L('Loading')
await p.goto('http://localhost:4173', { waitUntil: 'domcontentloaded', timeout: 15000 })
await p.evaluate(() => { localStorage.setItem('pixel-chef-lang','en'); localStorage.setItem('pixel-chef-tutorial-seen','1') })
await p.reload({ waitUntil: 'networkidle' })
await p.waitForTimeout(2000)
L('Loaded')

const s = async (n, d=600) => { await p.waitForTimeout(d); await p.screenshot({ path: resolve(DIR, n) }); L(' ✓ ' + n) }
const c = async (t, ms=4000) => {
  try {
    const l = p.locator('button:has-text("' + t + '")').first()
    await l.waitFor({ state: 'visible', timeout: ms })
    await l.click()
    L(' > ' + t)
    return true
  } catch (e) {
    L(' x ' + t + ' (no button)')
    return false
  }
}

try {
  // 3 studio
  L('3/6')
  await c('Start Cooking')
  await p.waitForTimeout(2500)
  for (let i=0;i<50;i++) try {
    const t = await p.locator('button').nth(i).textContent()
    if (/^[🥬🥩🥚🍅🧄🧅🫘🥕🌿🍚🍜🥦]/.test(t)) {
      await p.locator('button').nth(i).click()
      await p.waitForTimeout(250)
    }
  } catch {}
  await p.waitForTimeout(1500)
  await s('studio.png', 1200)

  // dismiss + cooking
  L('4/6')
  await c('KEEP MY RECIPE')
  await p.waitForTimeout(1500)
  await c('START COOKING')
  await p.waitForTimeout(1500)
  await c('Stir-fry')
  await p.waitForTimeout(500)
  await c('START COOKING')
  await p.waitForTimeout(2500)
  await c('AUTO COOK WITH AI')
  await p.waitForTimeout(4000)
  await s('cooking.png')

  // 5 result
  L('5/6')
  try { await p.locator(':has-text("COOKING COMPLETE")').first().waitFor({ timeout: 30000 }); L(' result!') } catch {}
  await p.waitForTimeout(2500)
  await s('result.png')

  // 6 memory
  L('6/6')
  await c('MEMORY')
  await p.waitForTimeout(2000)
  await s('memory.png')

  L('DONE')
} catch (e) {
  L('FATAL: ' + e.message)
} finally {
  await b.close()
}
