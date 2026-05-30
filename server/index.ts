import express from 'express'
import cors from 'cors'
import 'dotenv/config'

const app = express()
app.use(cors())
app.use(express.json())

const AI_API_KEY = process.env.AI_API_KEY || process.env.DEEPSEEK_API_KEY
const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.deepseek.com'
const AI_MODEL = process.env.AI_MODEL || 'deepseek-chat'

const PORT = process.env.PORT || 3099

/**
 * 给 AI 的系统提示词
 */
function buildSystemPrompt(): string {
  return `你是 DBTI（Director Based Type Indicator）的分析师，一个毒舌但精准的电影人格测评师。

你的任务：
1. 根据用户的 10 道题答题记录，从给定的 12+4 种 DBTI 人格中选出最匹配的 1 个
2. 用中文输出分析结果，格式固定为 JSON

分析原则：
- 仔细看用户的每个选择：选了哪个导演的哪部作品
- 观察模式：用户偏爱哪种类型的作品？代表作/争议作/小众/其他/没看过？
- 如果用户超过一半选了「没看过」，优先匹配"影坛白纸"
- 如果用户超过一半选了「小众佳作」，优先匹配"小众装逼犯"
- 如果用户超过一半选了「争议之作」，优先匹配"吃瓜群众"
- 如果用户超过一半选了「代表作」，优先匹配"大众点评"
- 否则根据作品中的 vibe 标签分布来匹配最接近的人格
- matchScore 要基于匹配置信度给出合理分数（0-100）

输出格式（严格 JSON，不要 markdown 代码块，只输出纯 JSON）：
{
  "typeId": "匹配的人格 ID",
  "matchScore": 85,
  "matchReason": "一段 80-120 字的分析，用中文解释为什么用户匹配这个类型，要具体引用用户的选择证据",
  "roast": "一段 60-100 字的锐评，毒舌但有趣，像朋友间开玩笑的那种损，不要真的冒犯",
  "recommendations": ["推荐电影1", "推荐电影2", "推荐电影3"]
}

注意：roast 要中文、毒舌、一针见血，但保留幽默感。不要人身攻击。`
}

/**
 * 构建用户答题数据给 AI
 */
function buildUserDataPrompt(
  answers: unknown,
  directors: unknown,
  types: unknown,
): string {
  return `以下是用户的 10 道题答题记录：
${JSON.stringify(answers, null, 2)}

以下是导演数据库（供参考）：
${JSON.stringify(directors, null, 2)}

以下是所有 DBTI 人格定义：
${JSON.stringify(types, null, 2)}

请根据以上数据，分析用户匹配哪一种 DBTI 人格，并输出 JSON 结果。`
}

app.post('/api/analyze', async (req, res) => {
  try {
    const { answers, directors, types } = req.body

    if (!answers || !directors || !types) {
      res.status(400).json({ error: '缺少必要参数：answers, directors, types' })
      return
    }

    if (!AI_API_KEY) {
      // 没有 API key：退回本地算法结果
      res.status(503).json({
        error: 'AI_API_KEY 未配置',
        fallback: true,
        message: 'AI 分析不可用，请设置 AI_API_KEY 环境变量以启用 AI 人格分析',
      })
      return
    }

    const response = await fetch(`${AI_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user', content: buildUserDataPrompt(answers, directors, types) },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('AI API error:', response.status, errText)
      res.status(502).json({
        error: 'AI API 调用失败',
        detail: errText,
        fallback: true,
      })
      return
    }

    const data = await response.json()
    const aiContent = data.choices?.[0]?.message?.content

    if (!aiContent) {
      res.status(502).json({ error: 'AI 返回空结果', fallback: true })
      return
    }

    // 尝试解析 AI 返回的 JSON
    // 有时候 AI 会包装 markdown 代码块
    let cleaned = aiContent.trim()
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '')
    }

    const parsed = JSON.parse(cleaned)
    res.json({ success: true, analysis: parsed })
  } catch (err) {
    console.error('Server error:', err)
    res.status(500).json({
      error: '服务器内部错误',
      detail: String(err),
      fallback: true,
    })
  }
})

app.listen(PORT, () => {
  console.log(`🧠 DBTI AI Analysis Server running on http://localhost:${PORT}`)
})
