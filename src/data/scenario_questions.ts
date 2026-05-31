import type { ChoiceQuestion } from '@/types'

/**
 * 7 道情景题 — 模拟真实的观影场景选择。
 * 每道题的选项直接映射到人格维度。
 */
export const scenarioQuestions: ChoiceQuestion[] = [
  {
    id: 'sc_1',
    type: 'scenario',
    question: '和一群人看电影你通常会？',
    options: [
      { text: '提前做功课了解背景', dims: { m: 1 } },
      { text: '直接看不想被剧透', dims: { s: 1 } },
    ],
  },
  {
    id: 'sc_2',
    type: 'scenario',
    question: '看完争议很大的电影你的第一反应是？',
    options: [
      { text: '看豆瓣影评看别人怎么说', dims: { c: 1 } },
      { text: '先自己消化形成判断', dims: { g: 1 } },
    ],
  },
  {
    id: 'sc_3',
    type: 'scenario',
    question: '一部电影看了20分钟觉得不对味你会？',
    options: [
      { text: '坚持看完可能后面精彩', dims: { o: 1 } },
      { text: '果断关掉不浪费时间', dims: { a: 1 } },
    ],
  },
  {
    id: 'sc_4',
    type: 'scenario',
    question: '去电影院看电影你怎么选座位？',
    options: [
      { text: '提前研究最佳位置', dims: { m: 1 } },
      { text: '差不多随缘', dims: { s: 1 } },
    ],
  },
  {
    id: 'sc_5',
    type: 'scenario',
    question: '朋友狂推一部你没听过但豆瓣不到7分的片你会？',
    options: [
      { text: '相信朋友马上找来看', dims: { g: 1 } },
      { text: '先问清楚好看在哪再决定', dims: { c: 1 } },
    ],
  },
  {
    id: 'sc_6',
    type: 'scenario',
    question: '走进电影碟店你会被什么吸引？',
    options: [
      { text: '海报最显眼的商业大片', dims: { p: 1 } },
      { text: '角落里封面怪异的小众冷门', dims: { n: 1 } },
    ],
  },
  {
    id: 'sc_7',
    type: 'scenario',
    question: '看完开放式结局的电影你的反应是？',
    options: [
      { text: '喜欢留给想象空间', dims: { a: 1 } },
      { text: '有点不爽想知道明确结局', dims: { o: 1 } },
    ],
  },
]
