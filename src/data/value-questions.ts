import type { ChoiceQuestion } from '@/types'

/**
 * DBTI 价值观附加题（4 道）。
 *
 * 每道题直接映射到四维人格维度，不依赖导演知识，确保：
 *   - 不认识导演的用户也能贡献有效数据
 *   - 每道题的信号干净、无歧义
 *
 * 作为 ChoiceQuestion 类型，可与其他题型统一处理。
 */
export const valueQuestions: ChoiceQuestion[] = [
  {
    id: 'v_choice',
    type: 'value',
    question: '周末想找部电影看，你一般会怎么选？',
    options: [
      {
        text: '打开热榜挑评分最高讨论最火的',
        dims: { p: 1 },
      },
      {
        text: '翻收藏夹找冷门或老片',
        dims: { n: 1 },
      },
    ],
  },
  {
    id: 'v_rating',
    type: 'value',
    question: '朋友推荐一部豆瓣6.5但说特别对你口味的电影，你会？',
    options: [
      {
        text: '评分说明问题不浪费时间',
        dims: { c: 1 },
      },
      {
        text: '评分不代表一切朋友懂我就看',
        dims: { g: 1 },
      },
    ],
  },
  {
    id: 'v_narrative',
    type: 'value',
    question: '你更喜欢哪种叙事？',
    options: [
      {
        text: '线性叙事起承转合清晰',
        dims: { o: 1 },
      },
      {
        text: '非线性多线交织开放式结尾',
        dims: { a: 1, n: 1 },
      },
    ],
  },
  {
    id: 'v_talk',
    type: 'value',
    question: '和朋友聊电影时你通常？',
    options: [
      {
        text: '能聊导演风格和镜头语言',
        dims: { m: 1, n: 1 },
      },
      {
        text: '大概说得出好不好看但聊不深',
        dims: { s: 1, p: 1 },
      },
    ],
  },
]
