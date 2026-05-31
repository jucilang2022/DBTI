import express from 'express'
import cors from 'cors'
import 'dotenv/config'

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))

const AI_API_KEY = process.env.AI_API_KEY || process.env.DEEPSEEK_API_KEY
const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.deepseek.com'
const AI_MODEL = process.env.AI_MODEL || 'deepseek-chat'
const hasValidApiKey = Boolean(AI_API_KEY && !AI_API_KEY.includes('your-') && !AI_API_KEY.includes('here'))

const PORT = process.env.PORT || 3099

/**
 * 构建 DBTI 类型定义摘要（给 AI 判断用）
 */
function buildTypesSummary(types: { id: string; name: string; tagline: string; tags: string[]; spiritDirector: string; description: string; quote: string }[]): string {
  return types.map((t) =>
    `${t.id}（${t.name}）\n  slogan：${t.tagline}\n  维度标签：${t.tags.join('、')}\n  精神导演：${t.spiritDirector}\n  详细描述：${t.description}\n  金句：${t.quote}`
  ).join('\n\n')
}

/**
 * 构建设置 prompt
 */
function buildSystemPrompt(typesSummary: string): string {
  return `你是 DBTI（Director Based Type Indicator）的电影人格分析师。
你的任务完全独立——根据用户的 16 道答题记录，从以下 16 种人格类型中选出最匹配的一个，并生成个性化分析。

注意：你不需要依赖任何外部算法结果，完全基于答题数据独立判断。

以下是 16 种 DBTI 人格类型定义：

${typesSummary}

分析原则：
- 仔细分析用户每道题的选择，找出选择模式
- 维度一 — P（大众 Commercial）vs N（特色 Niche）：用户偏向主流商业片还是小众艺术片？
- 维度二 — C（经典 Canonical）vs G（邪典 Guilty-pleasure）：用户追随评分权威还是有自己的独立判断？
- 维度三 — O（正统 Orthodox）vs A（独到 Alternative）：用户认同传统叙事还是偏爱实验表达？
- 维度四 — M（核心 Cinephile）vs S（随性 Spontaneous）：用户是深度影迷还是轻松观影者？
- 有些类型的组合很稀有（如 NGAM 需要同时特色+邪典+独到+核心），只有在数据明确支持时才选出
- 如果用户大部分选「没看过」，选 NEWBIE 类型
- 如果用户选择模式非常混合没有明确倾向，选最接近的类型

输出格式（严格 JSON，不要 markdown 代码块，只输出纯 JSON）：
{
  "typeId": "PCOM / NGAM / NEWBIE 等 16 型编码",
  "matchScore": 85,
  "matchReason": "一段 100-150 字的分析，用中文解释为什么用户匹配这个类型，要具体引用用户的选择证据",
  "roast": "一段 80-120 字的锐评，毒舌但有趣，像朋友间开玩笑的那种损，不要真的冒犯",
  "recommendations": ["推荐电影1", "推荐电影2", "推荐电影3"]
}

注意：roast 要中文、毒舌、一针见血。不要人身攻击。`
}

app.post('/api/analyze', async (req, res) => {
  try {
    const { questionAnswers, types } = req.body

    if (!questionAnswers || !types) {
      res.status(400).json({ error: '缺少必要参数：questionAnswers, types' })
      return
    }

    if (!hasValidApiKey) {
      res.status(503).json({ error: 'AI_API_KEY 未配置', fallback: true })
      return
    }

    // 构建答题数据摘要
    const answersSummary = questionAnswers.map((qa: { type: string; question: string; options: string[]; selected: number }, i: number) => {
      const selectedText = qa.options[qa.selected] ?? '（未选择）'
      return `第 ${i + 1} 题 [${qa.type}]
${qa.question}
选项：
${qa.options.map((o: string, j: number) => `  ${j === qa.selected ? '→' : ' '} ${o}`).join('\n')}
用户选择：${selectedText}`
    }).join('\n\n')

    const typesSummary = buildTypesSummary(types)

    const response = await fetch(`${AI_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: buildSystemPrompt(typesSummary) },
          { role: 'user', content: `以下是用户的 16 道答题记录，请分析选择模式并输出最匹配的 DBTI 类型：\n\n${answersSummary}` },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('AI API error:', response.status, errText)
      res.status(502).json({ error: 'AI API 调用失败', detail: errText, fallback: true })
      return
    }

    const data = await response.json()
    const aiContent = data.choices?.[0]?.message?.content

    if (!aiContent) {
      res.status(502).json({ error: 'AI 返回空结果', fallback: true })
      return
    }

    let cleaned = aiContent.trim()
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '')
    }

    const parsed = JSON.parse(cleaned)

    // 验证 AI 返回了有效的 typeId
    const validIds = new Set(types.map((t: { id: string }) => t.id))
    validIds.add('NEWBIE')
    if (!parsed.typeId || !validIds.has(parsed.typeId)) {
      console.warn('AI returned invalid typeId:', parsed.typeId)
      // 尝试从返回中修复或返回错误
      res.status(502).json({ error: 'AI 返回了无效的类型编码', detail: parsed, fallback: true })
      return
    }

    res.json({ success: true, analysis: parsed })
  } catch (err) {
    console.error('Server error:', err)
    res.status(500).json({ error: '服务器内部错误', detail: String(err), fallback: true })
  }
})

app.listen(PORT, () => {
  console.log(`🧠 DBTI AI Analysis Server running on http://localhost:${PORT}`)
})
