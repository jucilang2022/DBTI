import express from 'express'
import cors from 'cors'
import 'dotenv/config'

const app = express()
app.use(cors())
app.use(express.json())

const AI_API_KEY = process.env.AI_API_KEY || process.env.DEEPSEEK_API_KEY
const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.deepseek.com'
const AI_MODEL = process.env.AI_MODEL || 'deepseek-chat'
const hasValidApiKey = Boolean(AI_API_KEY && !AI_API_KEY.includes('your-') && !AI_API_KEY.includes('here'))

const PORT = process.env.PORT || 3099

/**
 * 给 AI 的系统提示词
 */
function buildSystemPrompt(): string {
  return `你是 DBTI（Director Based Type Indicator）的分析师，一个毒舌但精准的电影人格测评师。

你的任务：
1. 根据本地算法已经算出的 DBTI 类型，生成个性化中文分析
2. 用中文输出分析结果，格式固定为 JSON

分析原则：
- 仔细看用户的每个选择：8 道导演题（选了哪位导演的哪部作品）+ 6 道价值观题（反映了什么电影观念）
- 导演题观察模式：用户偏爱哪种类型的作品？代表作/争议作/特色/其他/没看过？
- 价值观题进一步印证用户的电影品味：喜欢大众还是小众？尊重评分还是有独立判断？偏爱传统叙事还是实验表达？属于深度影迷还是随性观众？
- 「其他作品」不是数据库中的某一部具体电影，表示用户有自己的偏好，不被给出的答案拘束；不要把它映射成某个导演的固定作品
- 「特色佳作」是用户明确选择了一部具体电影，不是「没看过」
- 「没看过」只能来自 choiceLabel 为「没看过」或 choice 为 "unknown" 的答题记录；严禁把「特色佳作」或「其他作品」说成没看过
- 价值观题是二选一题型，用户的选择直接反映了某一维度的倾向，分析时结合导演题佐证
- 不使用特殊人格兜底；即使用户大量选择「没看过」或「代表作」，也必须从给定的 16 种 DBTI 中选择
- DBTI 类型已由本地四维算法确定，你必须沿用用户数据里的 localResult.typeId，不要自行改成其他类型
- 根据 localResult.choiceCounts 和 valueQuestionCount 里的真实数据解释为什么 localResult.typeId 合理；不得编造与数据相反的数量
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
  valueAnswers: unknown,
  directors: unknown,
  types: unknown,
  localResult: unknown,
): string {
  let prompt = `以下是用户的 8 道导演选择题答题记录：
${JSON.stringify(answers, null, 2)}
`

  if (valueAnswers && Array.isArray(valueAnswers) && valueAnswers.length > 0) {
    prompt += `
以下是用户的 6 道价值观选择题答题记录：
${JSON.stringify(valueAnswers, null, 2)}
`
  }

  prompt += `
以下是导演数据库（供参考）：
${JSON.stringify(directors, null, 2)}

以下是所有 DBTI 人格定义：
${JSON.stringify(types, null, 2)}

以下是本地四维算法已经确定的结果，请务必沿用其中的 typeId：
${JSON.stringify(localResult, null, 2)}

请根据以上所有数据（导演题 + 价值观题），为 localResult.typeId 生成个性化分析，并输出 JSON 结果。`

  return prompt
}

app.post('/api/analyze', async (req, res) => {
  try {
    const { answers, valueAnswers, directors, types, localResult } = req.body

    if (!answers || !directors || !types || !localResult) {
      res.status(400).json({ error: '缺少必要参数：answers, directors, types, localResult' })
      return
    }

    if (!hasValidApiKey) {
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
          { role: 'user', content: buildUserDataPrompt(answers, valueAnswers, directors, types, localResult) },
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
