import type { ChoiceQuestion } from '@/types'

/**
 * DBTI 价值观附加题（7 道）。
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
        text: '打开热榜挑评分最高讨论最火的。',
        dims: { p: 1 },
      },
      {
        text: '翻收藏夹找冷门或老片。',
        dims: { n: 1 },
      },
      {
        text: '看心情随便点一部，随缘看。',
        dims: { s: 1 },
      },
    ],
  },
  {
    id: 'v_rating',
    type: 'value',
    question: '朋友推荐一部豆瓣6.5但说特别对你口味的电影，你会？',
    options: [
      {
        text: '评分说明问题不浪费时间。',
        dims: { c: 1 },
      },
      {
        text: '评分不代表一切，朋友懂我就看。',
        dims: { g: 1 },
      },
      {
        text: '先问清楚它到底好在哪里再决定。',
        dims: { m: 1, o: 1 },
      },
    ],
  },
  {
    id: 'v_narrative',
    type: 'value',
    question: '你更喜欢哪种叙事？',
    options: [
      {
        text: '线性叙事，起承转合清晰。',
        dims: { o: 1 },
      },
      {
        text: '非线性多线交织，开放式结尾。',
        dims: { a: 1, n: 1 },
      },
      {
        text: '不挑叙事形式，只看故事本身是否打动我。',
        dims: { s: 1, p: 1 },
      },
    ],
  },
  {
    id: 'v_talk',
    type: 'value',
    question: '和朋友聊电影时你通常？',
    options: [
      {
        text: '能聊导演风格和镜头语言。',
        dims: { m: 1, n: 1 },
      },
      {
        text: '大概说得出好不好看，但聊不深。',
        dims: { s: 1, p: 1 },
      },
      {
        text: '喜欢争论评分和排名，不服就辩。',
        dims: { c: 1, g: 1 },
      },
    ],
  },
  {
    id: 'v_rewatch',
    type: 'value',
    question: '一部特别打动你的电影，你愿意反复重看吗？',
    options: [
      {
        text: '会，每次重看都能发现新细节和新感受。',
        dims: { m: 1, n: 1 },
      },
      {
        text: '很少重看，好电影一次就够了，想看新的。',
        dims: { a: 1, s: 1 },
      },
      {
        text: '看心情，经典片段会翻出来反复刷。',
        dims: { p: 1, o: 1 },
      },
    ],
  },
  {
    id: 'v_spoiler',
    type: 'value',
    question: '看新片之前你接受剧透吗？',
    options: [
      {
        text: '完全不能忍，剧透毁掉全部观影体验。',
        dims: { a: 1, n: 1 },
      },
      {
        text: '无所谓，好片子哪怕知道结局依然精彩。',
        dims: { c: 1, o: 1 },
      },
      {
        text: '梗概可以接受，但核心反转必须保密。',
        dims: { m: 1, s: 1 },
      },
    ],
  },
  {
    id: 'v_mood',
    type: 'value',
    question: '心情不好的时候你会选什么电影看？',
    options: [
      {
        text: '找一部轻松的喜剧或动画片转换心情。',
        dims: { p: 1, g: 1 },
      },
      {
        text: '看一部悲伤的电影好好哭一场释放情绪。',
        dims: { n: 1, a: 1 },
      },
      {
        text: '看经典的励志片或治愈系老片。',
        dims: { c: 1, o: 1 },
      },
    ],
  },
]
