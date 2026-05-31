import type { ChoiceQuestion } from '@/types'

/**
 * 9 道自我认知题 — 反映用户对豆瓣评分生态和自身影迷身份的认知。
 * 选项数 3 个，直接映射人格维度。
 */
export const selfCognitionQuestions: ChoiceQuestion[] = [
  {
    id: 'self_1',
    type: 'self_cognition',
    question: '《肖申克的救赎》常年霸占豆瓣TOP1你认为这个地位？',
    options: [
      { text: '实至名归，它承载了最多人的共鸣。', dims: { c: 1 } },
      { text: '有点过誉，豆瓣榜单审美偏单一。', dims: { g: 1 } },
      { text: '正常，质量过硬但也不算神作。', dims: { o: 1 } },
    ],
  },
  {
    id: 'self_2',
    type: 'self_cognition',
    question: '《地球最后的夜晚》戛纳评价两极豆瓣6.9你怎么看？',
    options: [
      { text: '分低了，大众对实验电影太苛刻。', dims: { n: 1, a: 1 } },
      { text: '分差不多了，就是少数人的菜。', dims: { o: 1 } },
      { text: '分高了，就是部装逼片。', dims: { p: 1 } },
    ],
  },
  {
    id: 'self_3',
    type: 'self_cognition',
    question: '一部你私心很爱的冷门片豆瓣不到7分你会？',
    options: [
      { text: '觉得豆瓣越来越不靠谱了。', dims: { g: 1 } },
      { text: '理解不是所有人都能get到。', dims: { a: 1 } },
      { text: '遗憾但不意外，它确实不够大众。', dims: { o: 1 } },
    ],
  },
  {
    id: 'self_4',
    type: 'self_cognition',
    question: '《星际穿越》豆瓣9.4远超一般商业科幻片你觉得？',
    options: [
      { text: '合理，商业与艺术兼备的好片。', dims: { c: 1 } },
      { text: '过高了，诺兰光环加成。', dims: { g: 1 } },
      { text: '低了，它比很多9分文艺片更打动我。', dims: { a: 1, n: 1 } },
    ],
  },
  {
    id: 'self_5',
    type: 'self_cognition',
    question: '《逐梦演艺圈》豆瓣2.2分你认为？',
    options: [
      { text: '活该，烂片就该低分。', dims: { c: 1, o: 1 } },
      { text: '太低了，可能没烂到这个程度。', dims: { g: 1 } },
      { text: '这电影不值得认真讨论。', dims: { a: 1 } },
    ],
  },
  {
    id: 'self_6',
    type: 'self_cognition',
    question: '一部华语片戛纳获奖但豆瓣只有7分出头，你怎么看？',
    options: [
      { text: '国际奖项比豆瓣评分更有说服力。', dims: { n: 1, a: 1 } },
      { text: '豆瓣分更贴合国内观众的真实感受。', dims: { p: 1, o: 1 } },
      { text: '两个维度不同，都值得参考。', dims: { c: 1, m: 1 } },
    ],
  },
  {
    id: 'self_7',
    type: 'self_cognition',
    question: '你觉得自己在朋友圈里的电影品味属于什么水平？',
    options: [
      { text: '公认的权威，大家都在跟我看片。', dims: { m: 1, n: 1 } },
      { text: '还行，跟得上主流话题。', dims: { p: 1, s: 1 } },
      { text: '我的品味可能有点怪，朋友不太理解。', dims: { g: 1, a: 1 } },
    ],
  },
  {
    id: 'self_8',
    type: 'self_cognition',
    question: '豆瓣评分8.5以上的文艺片和7.5左右的商业片，你会优先看哪部？',
    options: [
      { text: '文艺片，高评分说明值得花时间。', dims: { n: 1, m: 1 } },
      { text: '商业片，娱乐体验更重要。', dims: { p: 1, g: 1 } },
      { text: '看评分结合简介，不按类型预判。', dims: { c: 1, o: 1 } },
    ],
  },
  {
    id: 'self_9',
    type: 'self_cognition',
    question: '一部导演之前的作品你都爱，但新作豆瓣评分跌到6分以下，你会？',
    options: [
      { text: '依然去看，相信导演的水平。', dims: { g: 1, a: 1 } },
      { text: '等口碑稳定了再说，不冒险。', dims: { c: 1, o: 1 } },
      { text: '第一时间看，作为迷影必须要见证全过程。', dims: { m: 1, n: 1 } },
    ],
  },
]
