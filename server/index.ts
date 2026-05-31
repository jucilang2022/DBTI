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
function buildSystemPrompt(
  typesSummary: string,
  localTypeId: string,
  localTypeName: string,
  dimensionSummary: string,
): string {
  return `你是 DBTI（Director Based Type Indicator）的电影人格分析师。
用户的 DBTI 类型已由本地算法根据答题统计确定，你绝对不能重新判定或推荐其他类型。

已确定的类型：${localTypeId}（${localTypeName}）

本地算法维度剖面（这是判定依据，你的解读必须与此一致）：
${dimensionSummary}

你的任务：基于上述已确定类型、维度剖面与用户 16 道答题记录，撰写个性化解读文案。
- 解释为什么这些选择支撑 ${localTypeId}（要具体引用用户的选择证据）
- 若某些单题选择「看起来」像其他类型，必须解释为：在整体维度加权统计下，仍指向 ${localTypeId}
- 写一段毒舌但有趣的锐评
- 推荐 5 部契合该用户口味的电影

以下是 16 种 DBTI 人格类型定义（仅供理解 ${localTypeId} 的含义，不要引用其他类型编码）：

${typesSummary}

维度说明：
- P（大众）vs N（特色）
- C（经典）vs G（邪典）
- O（正统）vs A（独到）
- M（核心）vs S（随性）

输出格式（严格 JSON，不要 markdown 代码块，只输出纯 JSON）：
{
  "matchReason": "一段 150-200 字的分析，用中文解释为什么用户的答题模式符合 ${localTypeId}（${localTypeName}），要具体引用用户的选择证据",
  "roast": "一段 120-160 字的锐评，毒舌但有趣，像朋友间开玩笑的那种损，不要真的冒犯",
  "recommendations": ["推荐电影1", "推荐电影2", "推荐电影3", "推荐电影4", "推荐电影5"]
}

硬性要求：
- 不要输出 typeId 或 matchScore
- matchReason 和 roast 中只能出现 ${localTypeId}，禁止出现 PCOM/NGAM/PCAM 等其他类型编码
- 禁止写「更符合 XX 型」「其实是 XX 型」等推翻判定结果的表述
- roast 要中文、毒舌、一针见血，不要人身攻击`
}

app.post('/api/analyze', async (req, res) => {
  try {
    const { questionAnswers, types, localTypeId, localTypeName, dimensionSummary } = req.body

    if (!questionAnswers || !types || !localTypeId) {
      res.status(400).json({ error: '缺少必要参数：questionAnswers, types, localTypeId' })
      return
    }

    const validIds = new Set(types.map((t: { id: string }) => t.id))
    if (!validIds.has(localTypeId)) {
      res.status(400).json({ error: '无效的 localTypeId', fallback: true })
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
    const typeName = localTypeName
      ?? types.find((t: { id: string }) => t.id === localTypeId)?.name
      ?? localTypeId

    const response = await fetch(`${AI_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: buildSystemPrompt(typesSummary, localTypeId, typeName, dimensionSummary ?? '（无剖面数据）') },
          { role: 'user', content: `用户的 DBTI 类型已确定为 ${localTypeId}（${typeName}）。请只为这一类型撰写解读，不要提及其他类型编码。\n\n${dimensionSummary ? `维度剖面：\n${dimensionSummary}\n\n` : ''}以下是 16 道答题记录：\n\n${answersSummary}` },
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

    if (!parsed.matchReason || !parsed.roast) {
      res.status(502).json({ error: 'AI 返回缺少必要文案字段', detail: parsed, fallback: true })
      return
    }

    const otherTypePattern = /\b(P|N)(C|G)(O|A)(M|S)\b/g
    const mentionedTypes = [...new Set(
      `${parsed.matchReason} ${parsed.roast}`.match(otherTypePattern) ?? [],
    )].filter((id) => id !== localTypeId)
    if (mentionedTypes.length > 0) {
      console.warn('AI mentioned other types:', mentionedTypes, 'expected:', localTypeId)
      res.status(502).json({
        error: 'AI 文案引用了其他类型编码',
        detail: { mentionedTypes, expected: localTypeId },
        fallback: true,
      })
      return
    }

    res.json({
      success: true,
      analysis: {
        typeId: localTypeId,
        matchReason: parsed.matchReason,
        roast: parsed.roast,
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
      },
    })
  } catch (err) {
    console.error('Server error:', err)
    res.status(500).json({ error: '服务器内部错误', detail: String(err), fallback: true })
  }
})

app.listen(PORT, () => {
  console.log(`🧠 DBTI AI Analysis Server running on http://localhost:${PORT}`)
})
