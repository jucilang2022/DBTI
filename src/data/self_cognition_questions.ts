import type { ChoiceQuestion } from '@/types'

/**
 * 15 道自我认知题 — 反映用户对豆瓣评分生态和自身影迷身份的认知。
 * 选项数 3~5 个，直接映射人格维度。
 */
export const selfCognitionQuestions: ChoiceQuestion[] = [
  {
    id: 'self_1',
    type: 'self_cognition',
    question: '《肖申克的救赎》常年霸占豆瓣TOP1你认为这个地位？',
    options: [
      { text: '实至名归，它承载了最多人的共鸣。', dims: { c: 1 } },
      { text: '比较过誉，豆瓣榜单审美偏单一。', dims: { g: 1 } },
      { text: '无感，质量过硬但也不算神作。', dims: { o: 1 } },
    ],
  },
  {
    id: 'self_2',
    type: 'self_cognition',
    question: '《地球最后的夜晚》戛纳获提名但豆瓣6.9分，你的看法是？',
    options: [
      { text: '分低了，大众对实验电影太苛刻。', dims: { n: 1, a: 1 } },
      { text: '分差不多了，就是少数人的菜。', dims: { o: 1 } },
      { text: '分高了，就是部装逼片。', dims: { n: 1 } },
    ],
  },
  {
    id: 'self_3',
    type: 'self_cognition',
    question: '一部你私心很爱的冷门片豆瓣不到7分你会？',
    options: [
      { text: '觉得豆瓣越来越不靠谱了，应该高分。', dims: { g: 1 } },
      { text: '理解不是所有人都能get到，但不应该低分。', dims: { a: 1 } },
      { text: '遗憾但不意外，它确实不够大众。', dims: { n: 1 } },
    ],
  },
  {
    id: 'self_4',
    type: 'self_cognition',
    question: '《星际穿越》豆瓣9.4远超一般商业科幻片你觉得？',
    options: [
      { text: '合理，商业与艺术兼备的好片。', dims: { c: 1 } },
      { text: '过高了，诺兰光环加成。', dims: { g: 1 } },
      { text: '低了，我心中的top10之一。', dims: { a: 1, n: 1 } },
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
      { text: '豆瓣分更贴合国内观众的真实感受。', dims: { p: 1, s: 1 } },
      { text: '两个维度不同，都值得参考。', dims: { c: 1, m: 1 } },
    ],
  },
  {
    id: 'self_7',
    type: 'self_cognition',
    question: '你觉得自己的电影品味在影迷中处于什么水平？',
    options: [
      { text: '公认的权威，大家都在跟我看片。', dims: { m: 1, n: 1 } },
      { text: '还行，跟得上主流话题。', dims: { p: 1, s: 1 } },
      { text: '我的品味可能有点怪，别人不太理解。', dims: { g: 1, o: 1 } },
    ],
  },
  {
    id: 'self_8',
    type: 'self_cognition',
    question: '豆瓣评分8.5以上的文艺片和7.5左右的商业片，你会优先看哪部？',
    options: [
      { text: '文艺片，高评分说明值得花时间。', dims: { c: 1, m: 1 } },
      { text: '商业片，娱乐体验更重要。', dims: { p: 1, g: 1 } },
      { text: '看评分结合简介，不按类型预判。', dims: { c: 1, o: 1 } },
    ],
  },
  {
    id: 'self_9',
    type: 'self_cognition',
    question: '一部导演之前的作品你都爱，但新作豆瓣评分跌到6分以下，你会？',
    options: [
      { text: '依然去看，相信导演的水平。', dims: { g: 1, o: 1 } },
      { text: '等口碑稳定了再说，不冒险。', dims: { c: 1, o: 1 } },
      { text: '不在意分数，作为迷影必须要见证全过程。', dims: { m: 1, g: 1 } },
    ],
  },
  {
    id: 'self_10',
    type: 'self_cognition',
    question: '翻出自己三年前给某部电影的打分，你觉得大概率会？',
    options: [
      { text: '基本认同，审美体系已经很稳定了。', dims: { c: 1, o: 1 } },
      { text: '可能会觉得当时打高了，年轻不懂事。', dims: { a: 1, n: 1 } },
      { text: '可能觉得当时打低了，当时没看懂。', dims: { m: 1, g: 1 } },
      { text: '评分不重要，感受是流动的，变了也没关系。', dims: { s: 1, p: 1 } },
    ],
  },
  {
    id: 'self_11',
    type: 'self_cognition',
    question: '豆瓣上很多人给晦涩的文艺片打高分，你觉得这是？',
    options: [
      { text: '真实的审美偏好，深度内容值得高评价。', dims: { c: 1, m: 1 } },
      { text: '一种圈层符号，打分背后有身份焦虑。', dims: { c: 1, n: 1 } },
      { text: '正常现象，任何平台都有自己的用户画像。', dims: { p: 1, s: 1 } },
      { text: '无所谓，别人打多少分关我什么事。', dims: { g: 1, a: 1 } },
    ],
  },
  {
    id: 'self_12',
    type: 'self_cognition',
    question: '豆瓣十分制，你觉得8分和9分的差距主要在于？',
    options: [
      { text: '工业水准和完成度的差距，差一分就是差一档。', dims: { c: 1, o: 1 } },
      { text: '个人情感共鸣度的问题，无法客观衡量。', dims: { g: 1, s: 1 } },
      { text: '传播度和大众认可度的差距。', dims: { p: 1, s: 1 } },
      { text: '很难说，有的8分片比9分片更打动我。', dims: { g: 1, s: 1 } },
    ],
  },
  {
    id: 'self_13',
    type: 'self_cognition',
    question: '如果有人用"观影量不够"来否定你的电影品味，你？',
    options: [
      { text: '承认自己确实看得不多，但品味不需要量来证明。', dims: { s: 1, p: 1 } },
      { text: '不服气，阅片量和审美能力没有直接关系。', dims: { g: 1, o: 1 } },
      { text: '默默接受，然后回去补片，用行动证明。', dims: { m: 1, o: 1 } },
      { text: '看情况，如果对方确实比我资深我认，否则免谈。', dims: { c: 1, g: 1 } },
    ],
  },
  {
    id: 'self_14',
    type: 'self_cognition',
    question: '你觉得"公平评分"这件事在电影领域可能吗？',
    options: [
      { text: '不可能，评分本质就是主观偏好的加总。', dims: { n: 1, a: 1 } },
      { text: '大致可能，评分体现了多数人的共识。', dims: { c: 1, p: 1 } },
      { text: '没必要追求公平，评分只是参考工具。', dims: { s: 1, o: 1 } },
      { text: '可以接近公平，但要区分类型和受众分层打分。', dims: { m: 1, g: 1 } },
    ],
  },
  {
    id: 'self_15',
    type: 'self_cognition',
    question: '你更倾向于相信资深的影评人还是豆瓣普通用户的评分？',
    options: [
      { text: '影评人，他们能从专业角度分析我不一定看出来的东西。', dims: { m: 1, o: 1 } },
      { text: '普通用户，他们的感受更真实，不装不端。', dims: { p: 1, s: 1 } },
      { text: '都不太信，我只看自己的真实感受。', dims: { g: 1, a: 1 } },
      { text: '结合来看，影评看分析，大众看热度。', dims: { c: 1, o: 1 } },
    ],
  },
  {
    id: 'self_16',
    type: 'self_cognition',
    question: '如果只能保留一种观影习惯，你会选？',
    options: [
      { text: '追热门大片，和朋友圈保持同频。', dims: { p: 1, s: 1 } },
      { text: '专挑低分争议片，享受独自辩护的快感。', dims: { g: 1, o: 1 } },
      { text: '按影史经典清单系统补片，稳扎稳打。', dims: { c: 1, m: 1 } },
      { text: '随机点开冷门片，撞大运式探索。', dims: { n: 1, a: 1 } },
    ],
  },
]
