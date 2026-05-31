import type { ChoiceQuestion } from '@/types'

/**
 * 5 道自我认知题 — 反映用户对豆瓣评分生态和自身影迷身份的认知。
 * 选项数 2-3 个，直接映射人格维度。
 */
export const selfCognitionQuestions: ChoiceQuestion[] = [
  {
    id: 'self_1',
    type: 'self_cognition',
    question: '《肖申克的救赎》常年霸占豆瓣TOP1你认为这个地位？',
    options: [
      { text: '实至名归它承载了最多人的共鸣', dims: { c: 1 } },
      { text: '有点过誉豆瓣榜单审美偏单一', dims: { g: 1 } },
      { text: '正常质量过硬但也不算神作', dims: { o: 1 } },
    ],
  },
  {
    id: 'self_2',
    type: 'self_cognition',
    question: '《地球最后的夜晚》戛纳评价两极豆瓣6.9你怎么看？',
    options: [
      { text: '分低了大众对实验电影太苛刻', dims: { n: 1, a: 1 } },
      { text: '分差不多了就是少数人的菜', dims: { o: 1 } },
      { text: '分高了就是部装逼片', dims: { p: 1 } },
    ],
  },
  {
    id: 'self_3',
    type: 'self_cognition',
    question: '一部你私心很爱的冷门片豆瓣不到7分你会？',
    options: [
      { text: '觉得豆瓣越来越不靠谱了', dims: { g: 1 } },
      { text: '理解不是所有人都能get到', dims: { a: 1 } },
      { text: '遗憾但不意外它确实不够大众', dims: { o: 1 } },
    ],
  },
  {
    id: 'self_4',
    type: 'self_cognition',
    question: '《星际穿越》豆瓣9.4远超一般商业科幻片你觉得？',
    options: [
      { text: '合理商业与艺术兼备的好片', dims: { c: 1 } },
      { text: '过高了诺兰光环加成', dims: { g: 1 } },
      { text: '低了它比很多9分文艺片更打动我', dims: { a: 1, n: 1 } },
    ],
  },
  {
    id: 'self_5',
    type: 'self_cognition',
    question: '《逐梦演艺圈》豆瓣2.2分你认为？',
    options: [
      { text: '活该烂片就该低分', dims: { c: 1, o: 1 } },
      { text: '太低了可能没烂到这个程度', dims: { g: 1 } },
      { text: '这电影不值得认真讨论', dims: { a: 1 } },
    ],
  },
]
