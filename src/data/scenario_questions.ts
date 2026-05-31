import type { ChoiceQuestion } from '@/types'

/**
 * 18 道情景题 — 模拟真实的观影场景选择。
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
  {
    id: 'sc_13',
    type: 'scenario',
    question: '你在视频网站看一部老片，弹幕疯狂刷"前方高能"，你会？',
    options: [
      { text: '马上关掉弹幕，不想被任何暗示干扰。', dims: { a: 1, n: 1 } },
      { text: '开着弹幕，大家一起反应才有氛围。', dims: { p: 1, g: 1 } },
      { text: '把弹幕调成半透明，不影响画面但能看梗。', dims: { o: 1, s: 1 } },
      { text: '专心看画面，弹幕只会在结束后回看。', dims: { m: 1, c: 1 } },
    ],
  },
  {
    id: 'sc_14',
    type: 'scenario',
    question: '电影院里旁边的人一直大声讨论剧情，你会？',
    options: [
      { text: '直接制止，影院礼仪不能忍。', dims: { c: 1, o: 1 } },
      { text: '默默忍受到散场，不想起冲突。', dims: { s: 1, p: 1 } },
      { text: '换座位远离噪音源。', dims: { a: 1, n: 1 } },
      { text: '内心暴躁但表面不动声色，散场后发朋友圈吐槽。', dims: { g: 1, a: 1 } },
    ],
  },
  {
    id: 'sc_15',
    type: 'scenario',
    question: '你加入了一个每月一次的电影俱乐部，首次聚会的片单你希望？',
    options: [
      { text: '选一部公认的经典，大家都有得聊。', dims: { c: 1, p: 1 } },
      { text: '大胆推荐一部冷门神作，测试大家的接受度。', dims: { n: 1, m: 1 } },
      { text: '选一部争议大的片子，方便展开讨论碰撞。', dims: { a: 1, g: 1 } },
      { text: '先看看别人推荐什么，下次再做主。', dims: { s: 1, o: 1 } },
    ],
  },
  {
    id: 'sc_16',
    type: 'scenario',
    question: '朋友说看不懂你最喜欢的一部电影，你会？',
    options: [
      { text: '耐心解释电影的主题和象征，希望能让他理解我的感动。', dims: { m: 1, c: 1 } },
      { text: '理解，这片本来就不是每个人的菜。', dims: { a: 1, o: 1 } },
      { text: '推荐另一部更容易入口但同样风格的作品。', dims: { p: 1, s: 1 } },
      { text: '不再多解释，享受只有自己能懂的孤独感。', dims: { n: 1, g: 1 } },
    ],
  },
  {
    id: 'sc_17',
    type: 'scenario',
    question: '短视频上刷到一部老电影的解说版，你从没看过原片，你会？',
    options: [
      { text: '看完解说就当看过了，节约时间。', dims: { s: 1, p: 1 } },
      { text: '立刻关掉去找原片看，解说会毁了第一体验。', dims: { a: 1, n: 1 } },
      { text: '看完解说后决定值不值得找原片看。', dims: { g: 1, o: 1 } },
      { text: '从来不看电影解说，那是对电影的不尊重。', dims: { m: 1, c: 1 } },
    ],
  },
  {
    id: 'sc_18',
    type: 'scenario',
    question: '你熬夜看完一部豆瓣8.5以上的神作却完全没有被打动，你会？',
    options: [
      { text: '怀疑自己是不是没看懂，重新看一遍找感觉。', dims: { m: 1, c: 1 } },
      { text: '接受自己和高分片不合拍，每个人都有盲区。', dims: { a: 1, o: 1 } },
      { text: '给差评，不能理解为什么大家这么吹。', dims: { g: 1, p: 1 } },
      { text: '放在一边，过段时间重看也许感受不同。', dims: { n: 1, s: 1 } },
    ],
  },
]
