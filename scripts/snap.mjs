/**
 * Pixel Chef AI — Screenshot capture v4 (most robust)
 */

import { resolve } from 'path'
import { mkdirSync, writeFileSync, appendFileSync } from 'fs'
import { chromium } from 'playwright'

const SCREENSHOTS_DIR = resolve(import.meta.dirname, '..', 'docs', 'screenshots')
const BASE = 'http://localhost:4173'
const LOG = resolve(import.meta.dirname, 'snap.log')

mkdirSync(SCREENSHOTS_DIR, { recursive: true })
writeFileSync(LOG, '--- ' + new Date().toISOString() + ' ---\n')
const log = (msg) => { console.log(msg); appendFileSync(LOG, msg + '\n') }

const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, locale: 'en-US' })
const page = await ctx.newPage()

page.on('pageerror', (err) => log('PAGE ERROR: ' + err.message))
page.on('console', (msg) => {
  if (msg.type() === 'error') log('CONSOLE ERROR: ' + msg.text())
})
page.on('crash', () => log('PAGE CRASH'))
page.on('close', () => log('PAGE CLOSE'))

const main = async () => {
  try {
    log('Loading ' + BASE)
    await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 15000 })
    await page.evaluate(() => {
      localStorage.setItem('pixel-chef-lang', 'en')
      localStorage.setItem('pixel-chef-tutorial-seen', '1')
    })
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(2500)

    const snap = async (name, delay = 600) => {
      await page.waitForTimeout(delay)
      await page.screenshot({ path: resolve(SCREENSHOTS_DIR, name) })
      log('  ✅ ' + name)
    }

    const tryClick = async (text, ms = 4000) => {
      try {
        const b = page.locator(`button:has-text("${text}")`).first()
        await b.waitFor({ state: 'visible', timeout: ms })
        await b.click()
        log('   click("' + text + '")')
        return true
      } catch (e) {
        log('   skip("' + text + '"): ' + e.message.split('\n')[0])
        return false
      }
    }

    // 1️⃣ hero
    log('1/6 hero.png')
    await snap('hero.png', 1200)

    // 2️⃣ home
    log('2/6 home.png')
    try {
      const interactive = page.locator('.cursor-pointer, [class*="fridge"]').first()
      if (await interactive.isVisible()) { await interactive.hover(); await page.waitForTimeout(500) }
    } catch (e) { log('  hover skip: ' + e.message.split('\n')[0]) }
    await snap('home.png')

    // 3️⃣ studio
    log('3/6 studio.png')
    await tryClick('Start Cooking')
    await page.waitForTimeout(2500)

    // Click the START COOKING in the header instead - it might be the same
    let selected = 0
    const btnCount = await page.locator('button').count()
    log('  total buttons: ' + btnCount)
    for (let i = 0; i < btnCount && selected < 5; i++) {
      try {
        const txt = ((await page.locator('button').nth(i).textContent()) || '').trim()
        if (txt.length > 60) continue  // skip long text buttons
        if (txt.match(/^[🥬🥩🥚🍅🧄🧅🫘🥕🌿🍚🍜🥦]/)) {
          await page.locator('button').nth(i).click()
          log('   click ingredient: ' + txt.slice(0, 30))
          await page.waitForTimeout(400)
          selected++
        }
      } catch (e) { log('   skip btn ' + i) }
    }
    log('  selected ' + selected + ' ingredients')
    await page.waitForTimeout(1200)
    await snap('studio.png')

    // 4️⃣ cooking
    log('4/6 cooking.png')
    await tryClick('START COOKING', 5000)
    await page.waitForTimeout(1000)
    await tryClick('Stir-fry', 3000)
    await page.waitForTimeout(500)
    await tryClick('START COOKING', 3000)
    await page.waitForTimeout(2500)
    await tryClick('AUTO COOK WITH AI', 5000)
    await page.waitForTimeout(5000)
    await snap('cooking.png')

    // 5️⃣ result
    log('5/6 result.png')
    try {
      await page.locator(':has-text("COOKING COMPLETE")').first().waitFor({ timeout: 30000 })
      log('   ✓ result page appears')
    } catch (e) { log('   result wait: ' + e.message.split('\n')[0]) }
    await page.waitForTimeout(3500)
    await snap('result.png')

    // 6️⃣ memory
    log('6/6 memory.png')
    await tryClick('MEMORY', 5000)
    await page.waitForTimeout(2000)
    await snap('memory.png')

    log('DONE')
  } catch (e) {
    log('FATAL: ' + e.message + '\n' + e.stack)
  } finally {
    await browser.close()
  }
}

main()
