import type { ValueQuestion } from '@/types'

/**
 * DBTI 价值观附加题（6 道）。
 *
 * 每道题直接映射到四维人格维度，不依赖导演知识，确保：
 *    - 不认识导演的用户也能贡献有效数据
 *    - 每道题的信号干净、无歧义
 */
export const valueQuestions: ValueQuestion[] = [
  {
    id: 'v_choice',
    question: '周末你想找部电影看，一般会怎么选？',
    options: [
      {
        text: '打开热门榜单，挑评分最高、讨论最火的',
        dims: { p: 1, c: 1 },
      },
      {
        text: '翻收藏夹或豆瓣豆列，找一部小众或老片',
        dims: { n: 1, g: 1 },
      },
    ],
  },
  {
    id: 'v_rating',
    question: '朋友推荐一部豆瓣 6.5 分但说特别对你口味的电影，你会？',
    options: [
      {
        text: '6.5 太低了，评分说明问题，不浪费时间',
        dims: { c: 1, o: 1 },
      },
      {
        text: '评分不代表一切，朋友懂我就看',
        dims: { g: 1, a: 1 },
      },
    ],
  },
  {
    id: 'v_narrative',
    question: '你更喜欢哪种叙事方式？',
    options: [
      {
        text: '线性叙事，起承转合清晰，故事讲得明明白白',
        dims: { o: 1 },
      },
      {
        text: '非线性多线交织、开放式结尾，看完越想越有味道',
        dims: { a: 1, n: 1 },
      },
    ],
  },
  {
    id: 'v_talk',
    question: '和朋友聊电影时，你通常是什么状态？',
    options: [
      {
        text: '能聊导演风格、镜头语言、叙事结构，头头是道',
        dims: { m: 1, n: 1 },
      },
      {
        text: '大概说得出好不好看，但聊不了太专业',
        dims: { s: 1, p: 1 },
      },
    ],
  },
  {
    id: 'v_excite',
    question: '看电影时，什么最让你兴奋？',
    options: [
      {
        text: '大场面特效、震撼配乐、顶级的视听享受',
        dims: { p: 1, o: 1 },
      },
      {
        text: '导演独特的个人风格和作者表达，每一帧都是艺术',
        dims: { n: 1, a: 1 },
      },
    ],
  },
  {
    id: 'v_core',
    question: '你认为一部好电影，最重要的是？',
    options: [
      {
        text: '故事讲得好，剧本扎实，逻辑自洽',
        dims: { o: 1, c: 1 },
      },
      {
        text: '氛围和情感到位，看完让人久久走不出来',
        dims: { a: 1, g: 1 },
      },
    ],
  },
]
