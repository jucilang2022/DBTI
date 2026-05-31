import type { ChoiceQuestion } from '@/types'

/**
 * 12 道情景题 — 模拟真实的观影场景选择。
 * 每道题的选项直接映射到人格维度。
 */
export const scenarioQuestions: ChoiceQuestion[] = [
  {
    id: 'sc_1',
    type: 'scenario',
    question: '和一群人看电影你通常会？',
    options: [
      { text: '提前做功课，了解一下背景。', dims: { m: 1 } },
      { text: '直接看，不想被剧透。', dims: { s: 1 } },
      { text: '负责挑片，选一部大家都能接受的。', dims: { p: 1, c: 1 } },
    ],
  },
  {
    id: 'sc_2',
    type: 'scenario',
    question: '看完争议很大的电影你的第一反应是？',
    options: [
      { text: '看豆瓣影评，看别人怎么说。', dims: { c: 1 } },
      { text: '先自己消化，形成判断。', dims: { g: 1 } },
      { text: '立刻找看过的人激烈讨论。', dims: { a: 1, m: 1 } },
    ],
  },
  {
    id: 'sc_3',
    type: 'scenario',
    question: '一部电影看了20分钟觉得不对味你会？',
    options: [
      { text: '坚持看完，可能后面精彩。', dims: { o: 1 } },
      { text: '果断关掉，不浪费时间。', dims: { a: 1 } },
      { text: '快进看看后面有没有亮点再决定。', dims: { s: 1, p: 1 } },
    ],
  },
  {
    id: 'sc_4',
    type: 'scenario',
    question: '去电影院看电影你怎么选座位？',
    options: [
      { text: '提前研究最佳位置，必须黄金区。', dims: { m: 1 } },
      { text: '差不多随缘，哪空坐哪。', dims: { s: 1 } },
      { text: '选后排角落，观影视野最完整。', dims: { n: 1, o: 1 } },
    ],
  },
  {
    id: 'sc_5',
    type: 'scenario',
    question: '朋友狂推一部你没听过但豆瓣不到7分的片你会？',
    options: [
      { text: '相信朋友，马上找来看。', dims: { g: 1 } },
      { text: '先问清楚好看在哪再决定。', dims: { c: 1 } },
      { text: '偷偷查一下导演是谁再做判断。', dims: { m: 1, n: 1 } },
    ],
  },
  {
    id: 'sc_6',
    type: 'scenario',
    question: '走进电影碟店你会被什么吸引？',
    options: [
      { text: '海报最显眼的商业大片。', dims: { p: 1 } },
      { text: '角落里封面怪异的小众冷门。', dims: { n: 1 } },
      { text: '按导演名字排序的区域慢慢翻。', dims: { m: 1, c: 1 } },
    ],
  },
  {
    id: 'sc_7',
    type: 'scenario',
    question: '看完开放式结局的电影你的反应是？',
    options: [
      { text: '喜欢留给想象空间。', dims: { a: 1 } },
      { text: '有点不爽，想知道明确结局。', dims: { o: 1 } },
      { text: '上网找解读，看看别人怎么理解的。', dims: { c: 1, m: 1 } },
    ],
  },
  {
    id: 'sc_8',
    type: 'scenario',
    question: '电影节排片撞了，两部都想看你怎么选？',
    options: [
      { text: '看评分更高的那部，品质优先。', dims: { c: 1, p: 1 } },
      { text: '看更冷门的那部，错过可能再也看不到。', dims: { n: 1, a: 1 } },
      { text: '提前做好攻略，哪个导演更值得追就选哪个。', dims: { m: 1, o: 1 } },
    ],
  },
  {
    id: 'sc_9',
    type: 'scenario',
    question: '约会时对方选了一部你不感兴趣的片你会？',
    options: [
      { text: '顺从对方，开心就好。', dims: { s: 1, p: 1 } },
      { text: '委婉推荐一部更好的替代。', dims: { c: 1, o: 1 } },
      { text: '说实话，看片品味也是互相了解的过程。', dims: { g: 1, a: 1 } },
    ],
  },
  {
    id: 'sc_10',
    type: 'scenario',
    question: '你准备订阅一个流媒体平台，怎么选？',
    options: [
      { text: '片库最大的那个，性价比最高。', dims: { p: 1, c: 1 } },
      { text: '独家和冷门片最多的平台。', dims: { n: 1, m: 1 } },
      { text: '看口碑和影迷圈子推荐再决定。', dims: { o: 1, s: 1 } },
    ],
  },
  {
    id: 'sc_11',
    type: 'scenario',
    question: '飞机上只有一部你没听过的国产烂片你会看吗？',
    options: [
      { text: '看，反正闲着也是闲着。', dims: { s: 1, g: 1 } },
      { text: '不看，宁可睡觉也不浪费时间。', dims: { c: 1, a: 1 } },
      { text: '看看评论，如果够雷够好笑就看。', dims: { p: 1, n: 1 } },
    ],
  },
  {
    id: 'sc_12',
    type: 'scenario',
    question: '朋友不声不响给你放了一部三个小时的黑白文艺片，你？',
    options: [
      { text: '礼貌看完，可能发现意外惊喜。', dims: { o: 1, n: 1 } },
      { text: '十分钟后偷偷看手机。', dims: { s: 1, p: 1 } },
      { text: '兴奋起来，这是我最喜欢的类型。', dims: { m: 1, a: 1 } },
    ],
  },
]
