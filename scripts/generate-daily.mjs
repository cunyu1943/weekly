#!/usr/bin/env node
/**
 * 「每日推荐」生成器
 *
 * - 文章头（frontmatter / 引言 / 号外）与尾（说明 / 联系）直接沿用
 *   docs/src/2026/model.md，与历史周刊保持一致，只替换标题；
 * - 一~五章节分别从历史各期对应章节的条目中随机抽取（默认每章 3 条），
 *   尽量来自不同期，条目原文（名称、链接、描述、配图）保持不变；
 * - 以「北京时间每天 6:00」为换日边界，日期即随机种子，当天内容稳定可复现，
 *   配合 .github/workflows/deploy.yml 中 UTC 22:00 的定时任务每日自动更新。
 *
 * 用法：
 *   node scripts/generate-daily.mjs                      # 按当前时间生成
 *   node scripts/generate-daily.mjs --date=2026-11-13  # 指定日期，用于预览/测试
 *   node scripts/generate-daily.mjs --count=3          # 每章抽取的条目数
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC_DIR = path.join(ROOT, 'docs', 'src')
const TEMPLATE_FILE = path.join(SRC_DIR, '2026', 'model.md')
const OUTPUT_FILE = path.join(SRC_DIR, 'daily.md')
const SECTIONS = ['一、项目', '二、软件', '三、网站', '四、插件', '五、资料']
const TAIL_ANCHOR = '## ✍️ 说明'
const SWITCH_HOUR = 6 // 北京时间，每天 6 点换一期

const argv = process.argv.slice(2)
function getArg(name, fallback) {
  const hit = argv.find((item) => item.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : fallback
}

const dateArg = getArg('date', '')
const perSection = Math.max(1, Number.parseInt(getArg('count', '3'), 10) || 3)
if (dateArg && !/^\d{4}-\d{2}-\d{2}$/.test(dateArg)) {
  console.error(`[daily] --date 需为 YYYY-MM-DD 格式，收到：${dateArg}`)
  process.exit(1)
}

// UTC 时间偏移 (8 - 6) 小时后取日期，正好让「北京时间 06:00」成为换日点：
// 无论定时任务在 06:00 前后几分钟执行，都属于同一个推荐日。
const day = dateArg || new Date(Date.now() + (8 - SWITCH_HOUR) * 3600_000).toISOString().slice(0, 10)

function hashSeed(text) {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function createRandom(seed) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle(list, random) {
  const arr = list.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function findArticles(dir) {
  const found = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'public' || entry.name === 'assets') continue
      found.push(...findArticles(full))
    } else if (entry.name.endsWith('.md') && full !== OUTPUT_FILE && full !== TEMPLATE_FILE) {
      found.push(full)
    }
  }
  return found
}

/** 解析一篇历史周刊，按栏目返回条目；没有一~五章节的文件会被自然跳过。 */
function parseArticle(file) {
  const lines = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n').split('\n')
  const relDir = path.relative(SRC_DIR, path.dirname(file)).split(path.sep).join('/')
  const source = `${relDir}/${path.basename(file, '.md')}`
  const buckets = new Map(SECTIONS.map((section) => [section, []]))
  let section = null
  let item = null

  const flush = () => {
    if (!item || !section) return
    const title = item.title.replace(/^\d+\s*\.\s*/, '').trim()
    const body = item.lines.join('\n').replace(/^\s*\n+/, '').replace(/\n+\s*$/, '')
    if (title && !/^!\[/.test(title)) {
      const link = /\[[^\]]*\]\(([^)\s]+)/.exec(title)?.[1] || ''
      buckets.get(section).push({ title, body, link, relDir, source })
    }
    item = null
  }

  for (const line of lines) {
    const h2 = /^##\s+(.+?)\s*$/.exec(line)
    if (h2) {
      flush()
      const name = h2[1].trim()
      section = SECTIONS.includes(name) ? name : null
      continue
    }
    if (!section) continue

    const h3 = /^###\s+(.+?)\s*$/.exec(line)
    if (h3) {
      // 少数历史文章把配图误写成三级标题，并入上一条目
      if (/^!\[[^\]]*\]\(/.test(h3[1])) {
        if (item) item.lines.push(line.replace(/^###\s+/, ''))
        continue
      }
      flush()
      item = { title: h3[1], lines: [] }
      continue
    }
    if (item) item.lines.push(line)
  }
  flush()
  return buckets
}

/**
 * 历史文章里的配图是相对各自年刊目录的 assets/xx.webp，
 * 搬到 docs/src/daily.md 后需改成以站点源目录为基准的相对路径，否则构建时找不到资源。
 */
function rewriteUrl(url, relDir, isImage) {
  if (/^(?:https?:)?\/\/|^[a-z][a-z0-9+.-]*:|^\/|^#/i.test(url)) return url
  const clean = decodeURIComponent(url.replace(/^\.\//, '').split(/[?#]/)[0])
  const abs = path.resolve(SRC_DIR, relDir, clean)
  if (isImage && !fs.existsSync(abs)) return null // 丢弃历史文章中已失效的配图
  return './' + path.relative(SRC_DIR, abs).split(path.sep).join('/')
}

function rewriteAssets(text, relDir) {
  return text
    .replace(/(!?\[[^\]]*\]\()([^)\s]*)([^)]*\))/g, (all, pre, url, post) => {
      if (!url) return all
      let next
      try {
        next = rewriteUrl(url, relDir, pre.startsWith('!'))
      } catch {
        return all
      }
      return next === null ? '' : pre + next + post
    })
    .replace(/(<img\b[^>]*?\bsrc=["'])([^"']+)(["'])/gi, (all, pre, url, post) => {
      let next
      try {
        next = rewriteUrl(url, relDir, true)
      } catch {
        return all
      }
      return next === null ? all : pre + next + post
    })
}

/** 先尽量从不同期中各取一条，数量不够时再放宽；同一条目不会重复出现。 */
function pick(pool, count, random) {
  const candidates = shuffle(pool, random)
  const chosen = []
  const seen = new Set()
  const sources = new Set()
  for (const allowSameSource of [false, true]) {
    for (const item of candidates) {
      if (chosen.length >= count) return chosen
      const key = item.link || item.title
      if (seen.has(key)) continue
      if (!allowSameSource && sources.has(item.source)) continue
      chosen.push(item)
      seen.add(key)
      sources.add(item.source)
    }
  }
  return chosen
}

/** 每日推荐没有公众号原文，去掉模板引言中的「原文」行及其前面的空引用行。 */
function stripOriginalSource(head) {
  const lines = []
  for (const line of head.split('\n')) {
    if (/^>\s*原文[：:]/.test(line)) {
      while (lines.length && /^>\s*$/.test(lines[lines.length - 1])) lines.pop()
      continue
    }
    lines.push(line)
  }
  return lines.join('\n')
}

function build() {
  const template = fs.readFileSync(TEMPLATE_FILE, 'utf8').replace(/\r\n/g, '\n')
  const splitAt = template.indexOf(TAIL_ANCHOR)
  if (splitAt < 0) {
    throw new Error(`模板 ${TEMPLATE_FILE} 中找不到「${TAIL_ANCHOR}」，无法拆分文章头尾`)
  }

  const [year, month, date] = day.split('-')
  const title = `# 每日推荐 · ${year} 年 ${Number(month)} 月 ${Number(date)} 日`
  const rawHead = template.slice(0, splitAt)
  const head = stripOriginalSource(
    /^# .+$/m.test(rawHead)
      ? rawHead.replace(/^# .+$/m, title)
      : `${title}\n\n${rawHead}`,
  )
  const tail = template.slice(splitAt).replace(/^\n+/, '')

  const articles = findArticles(SRC_DIR)
  const buckets = new Map(SECTIONS.map((section) => [section, []]))
  let issues = 0
  for (const file of articles) {
    const parsed = parseArticle(file)
    let hasSection = false
    for (const section of SECTIONS) {
      const items = parsed.get(section)
      if (items.length) hasSection = true
      buckets.get(section).push(...items)
    }
    if (hasSection) issues++
  }

  let output = head.replace(/\n+$/, '\n\n')
  const summary = []
  for (const section of SECTIONS) {
    const pool = buckets.get(section)
    if (!pool.length) throw new Error(`章节「${section}」没有可用条目，请检查历史文章格式`)
    const random = createRandom(hashSeed(`${day}|${section}`))
    const items = pick(pool, perSection, random)
    output += `## ${section}\n\n`
    output += items
      .map((item, index) => `### ${index + 1}. ${item.title}\n\n${rewriteAssets(item.body, item.relDir)}`)
      .join('\n\n')
    output += '\n\n'
    summary.push(`  ${section}：${pool.length} 条候选 → ${items.length} 条（${items.map((it) => it.source).join('、')}）`)
  }
  output += tail
  if (!output.endsWith('\n')) output += '\n'

  fs.writeFileSync(OUTPUT_FILE, output, 'utf8')
  console.log(`[daily] ${day}（北京时间 ${SWITCH_HOUR}:00 换日），扫描 ${issues} 期周刊`)
  console.log(summary.join('\n'))
  console.log(`[daily] 已生成 ${path.relative(ROOT, OUTPUT_FILE).split(path.sep).join('/')}`)
}

build()
