/**
 * 蒙特卡洛模拟：本地算法 16 型出现比例
 * 运行: node scripts/simulate-distribution.mjs
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// 动态加载编译较麻烦，直接内联 computeTypeCode + 简化 scoring 逻辑
function computeTypeCode(dims) {
  const hasP = (dims.p ?? 0) !== 0 || (dims.n ?? 0) !== 0
  const hasC = (dims.c ?? 0) !== 0 || (dims.g ?? 0) !== 0
  const hasO = (dims.o ?? 0) !== 0 || (dims.a ?? 0) !== 0
  const hasM = (dims.m ?? 0) !== 0 || (dims.s ?? 0) !== 0
  const d1 = hasP ? ((dims.p ?? 0) >= (dims.n ?? 0) ? 'P' : 'N') : '-'
  const d2 = hasC ? ((dims.c ?? 0) >= (dims.g ?? 0) ? 'C' : 'G') : '-'
  const d3 = hasO ? ((dims.o ?? 0) >= (dims.a ?? 0) ? 'O' : 'A') : '-'
  const d4 = hasM ? ((dims.m ?? 0) > (dims.s ?? 0) ? 'M' : 'S') : '-'
  return `${d1}${d2}${d3}${d4}`
}

function addDims(dims, delta) {
  for (const [k, v] of Object.entries(delta)) {
    dims[k] = (dims[k] ?? 0) + v
  }
}

function applyDirectorChoice(dims, choice) {
  switch (choice) {
    case 'famous': addDims(dims, { p: 1, c: 1, o: 1 }); break
    case 'hidden': addDims(dims, { n: 1, c: 1, a: 1 }); break
    case 'controversial': addDims(dims, { g: 1, a: 1 }); break
    case 'other': addDims(dims, { a: 1 }); break
  }
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickWeighted(items) {
  const total = items.reduce((s, i) => s + i.weight, 0)
  let r = Math.random() * total
  for (const item of items) {
    r -= item.weight
    if (r <= 0) return item.value
  }
  return items[items.length - 1].value
}

// 用 tsx 执行 TS 模块
async function loadModules() {
  const { analyzeQuiz } = await import(join(root, 'src/data/quiz-analyzer.ts'))
  const { compareQuestions } = await import(join(root, 'src/data/director_compare_questions.ts'))
  const { valueQuestions } = await import(join(root, 'src/data/value-questions.ts'))
  const { scenarioQuestions } = await import(join(root, 'src/data/scenario_questions.ts'))
  const { selfCognitionQuestions } = await import(join(root, 'src/data/self_cognition_questions.ts'))
  const { DBTI_TYPES } = await import(join(root, 'src/data/dbti-types.ts'))
  return { analyzeQuiz, compareQuestions, valueQuestions, scenarioQuestions, selfCognitionQuestions, DBTI_TYPES }
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildRandomQuiz(pool, compareQuestions, valueQuestions, scenarioQuestions, selfCognitionQuestions, directorChoiceModel) {
  const answers = []

  for (let i = 0; i < 4; i++) {
    const choice = pickWeighted(directorChoiceModel)
    if (choice !== 'unknown') {
      answers.push({
        questionType: 'director_work',
        questionId: `dir_${i}`,
        selectedIndex: 0,
        directorId: `dir_${i}`,
        choice,
      })
    } else {
      answers.push({
        questionType: 'director_work',
        questionId: `dir_${i}`,
        selectedIndex: 4,
        directorId: `dir_${i}`,
        choice: 'unknown',
      })
    }
  }

  for (const q of shuffle(compareQuestions).slice(0, 2)) {
    answers.push({
      questionType: 'director_compare',
      questionId: q.id,
      selectedIndex: Math.floor(Math.random() * q.directors.length),
    })
  }

  for (const q of shuffle(valueQuestions).slice(0, 3)) {
    answers.push({
      questionType: 'value',
      questionId: q.id,
      selectedIndex: Math.floor(Math.random() * q.options.length),
    })
  }

  for (const q of shuffle(scenarioQuestions).slice(0, 4)) {
    answers.push({
      questionType: 'scenario',
      questionId: q.id,
      selectedIndex: Math.floor(Math.random() * q.options.length),
    })
  }

  for (const q of shuffle(selfCognitionQuestions).slice(0, 3)) {
    answers.push({
      questionType: 'self_cognition',
      questionId: q.id,
      selectedIndex: Math.floor(Math.random() * q.options.length),
    })
  }

  return answers
}

function simulate(n, label, directorChoiceModel, analyzeQuiz, pools) {
  const counts = {}
  const dimLetterCounts = { d1: {}, d2: {}, d3: {}, d4: {} }

  for (let i = 0; i < n; i++) {
    const answers = buildRandomQuiz(
      null,
      pools.compareQuestions,
      pools.valueQuestions,
      pools.scenarioQuestions,
      pools.selfCognitionQuestions,
      directorChoiceModel,
    )
    const result = analyzeQuiz(
      answers,
      pools.compareQuestions,
      pools.valueQuestions,
      pools.scenarioQuestions,
      pools.selfCognitionQuestions,
    )
    const code = result.typeCode ?? '????'
    counts[code] = (counts[code] ?? 0) + 1
    if (code.length === 4) {
      dimLetterCounts.d1[code[0]] = (dimLetterCounts.d1[code[0]] ?? 0) + 1
      dimLetterCounts.d2[code[1]] = (dimLetterCounts.d2[code[1]] ?? 0) + 1
      dimLetterCounts.d3[code[2]] = (dimLetterCounts.d3[code[2]] ?? 0) + 1
      dimLetterCounts.d4[code[3]] = (dimLetterCounts.d4[code[3]] ?? 0) + 1
    }
  }

  console.log(`\n=== ${label} (${n.toLocaleString()} 次) ===`)
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
  for (const [code, c] of sorted) {
    const name = pools.DBTI_TYPES.find((t) => t.id === code)?.name ?? '(无效/含-)'
    const pct = ((c / n) * 100).toFixed(2)
    const bar = '█'.repeat(Math.round(Number(pct) / 2))
    console.log(`${code.padEnd(5)} ${pct.padStart(6)}%  ${bar}  ${name}`)
  }

  console.log('\n各维度字母边际比例:')
  for (const [dim, obj] of Object.entries(dimLetterCounts)) {
    const total = Object.values(obj).reduce((a, b) => a + b, 0)
    const parts = Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k}:${((v / total) * 100).toFixed(1)}%`)
      .join('  ')
    console.log(`  ${dim}: ${parts}`)
  }

  const never = pools.DBTI_TYPES.filter((t) => !counts[t.id]).map((t) => t.id)
  if (never.length) console.log(`\n未出现类型 (${never.length}): ${never.join(', ')}`)
  else console.log('\n16 型均至少出现 1 次')

  const top = sorted[0]
  const bottom = sorted.filter(([c]) => c !== '----' && !c.includes('-')).at(-1)
  if (top && bottom) {
    console.log(`\n最高/最低比: ${top[0]} ${((top[1] / n) * 100).toFixed(2)}% vs ${bottom[0]} ${((bottom[1] / n) * 100).toFixed(2)}% → ${(top[1] / bottom[1]).toFixed(1)}x`)
  }
}

const N = 50000

const mods = await loadModules()
const pools = { ...mods }

// 场景1: 完全随机（导演题各选项等概率，含 unknown）
simulate(N, '场景A — 完全随机答题', [
  { value: 'famous', weight: 1 },
  { value: 'controversial', weight: 1 },
  { value: 'hidden', weight: 1 },
  { value: 'other', weight: 1 },
  { value: 'unknown', weight: 1 },
], mods.analyzeQuiz, pools)

// 场景2:  realistic — 大众用户偏向代表作
simulate(N, '场景B — 偏大众用户（代表作 40%，没看过 15%）', [
  { value: 'famous', weight: 40 },
  { value: 'controversial', weight: 15 },
  { value: 'hidden', weight: 15 },
  { value: 'other', weight: 15 },
  { value: 'unknown', weight: 15 },
], mods.analyzeQuiz, pools)

// 场景3: 迷影用户 — 特色/争议偏多
simulate(N, '场景C — 偏迷影用户（特色+争议 55%）', [
  { value: 'famous', weight: 15 },
  { value: 'controversial', weight: 25 },
  { value: 'hidden', weight: 30 },
  { value: 'other', weight: 20 },
  { value: 'unknown', weight: 10 },
], mods.analyzeQuiz, pools)

// 单题边际：导演题 famous 的结构性影响
console.log('\n=== 结构性分析：导演题单选项维度贡献 ===')
console.log('famous      → P+1 C+1 O+1  (强推 PCO，不贡献 M/S)')
console.log('hidden      → N+1 C+1 A+1  (强推 NCA)')
console.log('controversial → G+1 A+1    (强推 GA，不推 P/N)')
console.log('other       → A+1')
console.log('unknown     → 跳过，不计分')
console.log('M/S 维度仅来自 12 道行为题，4 道导演题零贡献')
