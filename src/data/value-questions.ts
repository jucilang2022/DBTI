import type { ChoiceQuestion } from '@/types'

/**
 * DBTI 价值观附加题（16 道）。
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
    question: '对于故事片，你更喜欢哪种叙事？',
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
        dims: { m: 1, o: 1 },
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
        dims: { m: 1, c: 1 },
      },
      {
        text: '很少重看，好电影一次就够了，想看新的。',
        dims: { a: 1, s: 1 },
      },
      {
        text: '看心情，经典片段会翻出来反复刷。',
        dims: { p: 1, s: 1 },
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
  {
    id: 'v_8',
    type: 'value',
    question: '你一般通过什么渠道发现新电影？',
    options: [
      {
        text: '豆瓣榜单、短视频推荐，大家都在聊的。',
        dims: { p: 1, s: 1 },
      },
      {
        text: '影评人或关注已久的播客推荐，质量有保障。',
        dims: { m: 1, c: 1 },
      },
      {
        text: '顺着喜欢导演的片表往上下游挖掘。',
        dims: { n: 1, m: 1 },
      },
      {
        text: '电影节片单、蓝光发行消息和影展资讯。',
        dims: { n: 1, m: 1 },
      },
    ],
  },
  {
    id: 'v_9',
    type: 'value',
    question: '一部电影的原声带对你来说有多重要？',
    options: [
      {
        text: '非常重要，配乐决定了电影一半的情绪。',
        dims: { m: 1, o: 1 },
      },
      {
        text: '不太在意，剧情和表演才是核心。',
        dims: { c: 1, o: 1 },
      },
      {
        text: '好配乐是加分项，但不是决定性因素。',
        dims: { s: 1, p: 1 },
      },
      {
        text: '如果配乐能单独出圈，那这片值得关注。',
        dims: { a: 1, g: 1 },
      },
    ],
  },
  {
    id: 'v_10',
    type: 'value',
    question: '你如何看待同一部电影看多遍这件事？',
    options: [
      {
        text: '高质量的片子值得反复咀嚼，每次都有新收获。',
        dims: { m: 1, c: 1 },
      },
      {
        text: '世界上的好片都看不完，干嘛反复看同一部。',
        dims: { a: 1, s: 1 },
      },
      {
        text: '只对特别复杂或开放式的片子愿意二刷理清结构。',
        dims: { a: 1, n: 1 },
      },
      {
        text: '经典大片会重刷，主要是为了大银幕体验。',
        dims: { p: 1, g: 1 },
      },
    ],
  },
  {
    id: 'v_11',
    type: 'value',
    question: '看电影时你会在意导演的名气和履历吗？',
    options: [
      {
        text: '在意，导演过往作品是重要的参考指标。',
        dims: { m: 1, c: 1 },
      },
      {
        text: '不太在意，片子好就行，我不在乎谁拍的。',
        dims: { s: 1, p: 1 },
      },
      {
        text: '在意但不会先入为主，导演也有翻车的时候。',
        dims: { a: 1, n: 1 },
      },
      {
        text: '反而更爱看名导翻车，比安全牌有惊喜。',
        dims: { g: 1, o: 1 },
      },
    ],
  },
  {
    id: 'v_12',
    type: 'value',
    question: '你认为了解一部电影的历史背景和创作语境重要吗？',
    options: [
      {
        text: '很重要，脱离时代去看电影容易误读。',
        dims: { m: 1, o: 1 },
      },
      {
        text: '不重要，好作品应该超越时代直接打动观众。',
        dims: { p: 1, s: 1 },
      },
      {
        text: '看情况，有的片需要语境，有的不需要。',
        dims: { a: 1, n: 1 },
      },
      {
        text: '喜欢先自己感受，再回头了解背景验证判断。',
        dims: { a: 1, g: 1 },
      },
    ],
  },
  {
    id: 'v_13',
    type: 'value',
    question: '比起"致敬经典"的电影，你更喜欢什么？',
    options: [
      {
        text: '完全不遵守规则的先锋实验电影。',
        dims: { a: 1, n: 1 },
      },
      {
        text: '能把经典元素讲出新意的作品。',
        dims: { c: 1, o: 1 },
      },
      {
        text: '老老实实讲好一个故事的流畅电影。',
        dims: { p: 1, s: 1 },
      },
      {
        text: '故意冒犯观众审美、让人不舒服的电影。',
        dims: { g: 1, o: 1 },
      },
    ],
  },
  {
    id: 'v_14',
    type: 'value',
    question: '你觉得看电影之前做功课会增强还是削弱观影体验？',
    options: [
      {
        text: '增强，了解背景能捕捉更多细节。',
        dims: { m: 1, o: 1 },
      },
      {
        text: '削弱，一无所知时的第一感受最纯粹。',
        dims: { a: 1, s: 1 },
      },
      {
        text: '区别不大，功课不会改变电影本身的质量。',
        dims: { c: 1, o: 1 },
      },
      {
        text: '偶尔做做功课增加仪式感，也是一种乐趣。',
        dims: { p: 1, g: 1 },
      },
    ],
  },
  {
    id: 'v_15',
    type: 'value',
    question: '你怎么看待电影改编自真实事件或文学作品？',
    options: [
      {
        text: '原著为本，改编必须尊重原文精神。',
        dims: { a: 1, c: 1 },
      },
      {
        text: '好改编应该超越原著，创造独立的艺术价值。',
        dims: { n: 1, a: 1 },
      },
      {
        text: '无所谓来源，只看最终成片的质量。',
        dims: { p: 1, s: 1 },
      },
      {
        text: '真实事件改编的片更有分量，自带社会意义。',
        dims: { m: 1, g: 1 },
      },
    ],
  },
  {
    id: 'v_16',
    type: 'value',
    question: '看完一部让你困惑的电影后你会怎么做？',
    options: [
      {
        text: '立刻刷影评和解读，搞清楚导演到底想说什么。',
        dims: { c: 1, m: 1 },
      },
      {
        text: '让它悬着，好的困惑是一种享受。',
        dims: { n: 1, a: 1 },
      },
      {
        text: '和朋友讨论，听听不同角度的看法。',
        dims: { p: 1, g: 1 },
      },
      {
        text: '放下它继续看下一部，想不通就不想了。',
        dims: { s: 1, o: 1 },
      },
    ],
  },
  {
    id: 'v_17',
    type: 'value',
    question: '在选片时，你更相信哪种逻辑？',
    options: [
      { text: '热榜和大众口碑，跟着看不会大错。', dims: { p: 1, s: 1 } },
      { text: '低分高讨论，越争议越值得亲自验证。', dims: { g: 1, o: 1 } },
      { text: '冷门作者片，标记人数少反而更吸引我。', dims: { n: 1, m: 1 } },
      { text: '朋友随口安利，看着玩就行不必太认真。', dims: { s: 1, g: 1 } },
    ],
  },
  {
    id: 'v_18',
    type: 'value',
    question: '一部片如果「不好看但很有意思」，你会？',
    options: [
      { text: '仍然给高分，有意思比好看更重要。', dims: { g: 1, n: 1 } },
      { text: '给中等分，承认价值但不推荐给所有人。', dims: { o: 1, c: 1 } },
      { text: '给低分，电影首先得让人愿意看下去。', dims: { p: 1, s: 1 } },
      { text: '写长评辩护，这种片被误解太久了。', dims: { g: 1, m: 1 } },
    ],
  },
]
