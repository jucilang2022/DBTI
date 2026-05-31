import type { DBTIType } from '@/types'

/**
 * DBTI 16 型人格 — MBTI × 豆瓣影迷
 *
 * 四维字母：
 *   维度一   P (Popular) 大众  vs  N (Niche) 特色
 *   维度二   C (Canonical) 经典高分  vs  G (Guilty-pleasure) 邪典低分
 *   维度三   O (Orthodox) 正统  vs  A (Alternative) 独到
 *   维度四   M (Cinephile) 核心影迷  vs  S (Spontaneous) 随性轻度
 */

export const DBTI_TYPES: DBTIType[] = [
  // ===== P-C-O-* 大众高分正统派 =====
  {
    id: 'PCOM',
    name: '奥斯卡风向标',
    nameEn: 'Awards Tracker',
    tags: ['商业', '大众', '叙事', '情感'],
    tagline: '你的片单就是颁奖季的获奖名单。',
    description:
      '你选片稳、准、狠——要么是导演的公认代表作，要么是评分最高的经典。你相信大众口碑和权威榜单，而事实证明它们很少让你失望。从导演对比到你自己的认知判断，你始终站在主流审美那一边，但这不是因为盲目，而是因为你有自己成熟的评价标准。你的片单就是颁奖季的获奖名单。',
    spiritDirector: '斯皮尔伯格 / 李安 / 诺兰',
    quote: '"这部拿了奥斯卡最佳影片，应该不错。" ——你的选片标准。',
    recommendations: ['《辛德勒的名单》', '《霸王别姬》', '《肖申克的救赎》', '《断背山》'],
    color: '#f59e0b',
    rarity: 'common',
  },
  {
    id: 'PCOS',
    name: '大众评审',
    nameEn: 'Mainstream Jury',
    tags: ['商业', '大众', '叙事'],
    tagline: '看片只看热门的，评分只看高的。',
    description:
      '你平时不太有空追电影，所以选的时候非常精准——只挑最出名、评价最高的。你可能说不出太多导演的门道，但热门榜单上的片子你基本都看过。你不是影迷型观众，但你的观影判断很诚实：高分就是好，大家都看的就是值得看的。在关于评分的认知题里，你也是站在大众这一边的。',
    spiritDirector: '诺兰 / 卡梅隆 / 周星驰',
    quote: '"《星际穿越》？哦那个我看过！" ——你的日常。',
    recommendations: ['《盗梦空间》', '《阿凡达》', '《喜剧之王》', '《泰坦尼克号》'],
    color: '#d97706',
    rarity: 'common',
  },
  {
    id: 'PCAM',
    name: '精英鉴赏家',
    nameEn: 'Elite Connoisseur',
    tags: ['大众', '经典', '独到', '大师'],
    tagline: '大众经典你都懂，但你会给出自己的答案。',
    description:
      '你熟悉主流价值和经典体系，但你并不机械地按评分选片。你认同大部分公认的好作品，也会在关键时刻表达自己的独立判断。你在导演对比题中不会只选最出名的那位，而是有自己的偏好；在情景题中，你会在尊重规则和保留个性之间找到平衡。你能和普通观众聊得来，也能和影迷认真辩论。',
    spiritDirector: '库布里克 / 大卫·芬奇 / 诺兰',
    quote: '"《肖申克》是好片，但我心里最好的不一定是它。"',
    recommendations: ['《失眠症》', '《断锁怒潮》', '《本杰明·巴顿奇事》', '《致命魔术》'],
    color: '#8b5cf6',
    rarity: 'uncommon',
  },
  {
    id: 'PCAS',
    name: '品味新贵',
    nameEn: 'Taste Upstart',
    tags: ['大众', '经典', '独到', '入门'],
    tagline: '入坑不久，但已经开始有自己的答案。',
    description:
      '你看电影的时间不长，但已经不再是纯粹的榜单跟随者。你知道那些公认的经典，也开始意识到自己会被某些非标准的选择吸引。你可能还说不清楚自己到底喜欢什么风格，但在情景题和价值观题里，你已经隐隐约约有了偏向。方向是对的，多看点自然就成型了。',
    spiritDirector: '昆汀 / 大卫·芬奇 / 姜文',
    quote: '"我才看完《搏击俱乐部》……我觉得它讲的应该是……资本主义？"',
    recommendations: ['《搏击俱乐部》', '《美国往事》', '《消失的爱人》', '《低俗小说》'],
    color: '#a78bfa',
    rarity: 'common',
  },

  // ===== P-G-O-* 大众争议派 =====
  {
    id: 'PGOM',
    name: '爆米花国王',
    nameEn: 'Popcorn King',
    tags: ['大众', '娱乐', '类型', '爽片'],
    tagline: '评分不重要，爽就完了。',
    description:
      '你对导演的认识很主流，但你的评价标准不完全跟着评分走。只要节奏够快、场面够爽、情绪给到位，你就愿意买账。你不是为了反叛才喜欢争议片，你只是觉得电影首先应该好看、好笑、够刺激。在导演对比题里你也会选那位让人看得最过瘾的那位。你在自我认知题里也认为分数没有那么绝对。',
    spiritDirector: '周星驰 / 迈克尔·贝 / 宁浩',
    quote: '"豆瓣才6.5？我觉得挺好看的啊！"',
    recommendations: ['《功夫》', '《疯狂的赛车》', '《变形金刚1》', '《唐人街探案》'],
    color: '#f97316',
    rarity: 'common',
  },
  {
    id: 'PGOS',
    name: '快乐看客',
    nameEn: 'Happy Viewer',
    tags: ['大众', '娱乐', '商业'],
    tagline: '看电影就图一乐，别整太复杂。',
    description:
      '你拿电影当放松工具，不需要什么高深的理由。热门大制作、商业喜剧、动作大片——你知道的导演也就那几位最出名的，但你没关系。你的价值观很简单：电影就是娱乐。在情景题里，你选择轻松随意的方式；在认知题里，你也不觉得低分片有什么好争辩的。你的观影体验很纯粹：好看就是好。',
    spiritDirector: '（开心就好）',
    quote: '"我感觉挺好的啊，他们为什么评分那么低？"',
    recommendations: ['《功夫》', '《疯狂的石头》', '《夏洛特烦恼》', '《让子弹飞》'],
    color: '#fb923c',
    rarity: 'common',
  },
  {
    id: 'PGAM',
    name: '邪典猎手',
    nameEn: 'Cult Hunter',
    tags: ['反叛', '突破', '黑色', '暴力'],
    tagline: '高分你嫌俗，低分你看出花来了。',
    description:
      '你是那种会为一部低分片写几千字辩护长文的人。你觉得大众评分是狗屎，真正的宝藏都藏在争议区。你最爱那些导演放飞自我、口碑两极的作品——因为翻车才暴露一个导演最真实的野心。在价值观题里你选独立判断而非权威评分，在情景题里你会坚持自己的看法，哪怕跟大多数人不一样。',
    spiritDirector: '拉斯·冯·提尔 / 三池崇史 / 大卫·林奇',
    quote: '"你们都说这是导演最烂的作品？我觉得这是他最真诚的一次。"',
    recommendations: ['《女性瘾者》', '《杀手阿一》', '《沙丘(1984)》', '《妖夜慌踪》'],
    color: '#dc2626',
    rarity: 'rare',
  },
  {
    id: 'PGAS',
    name: '野生评论家',
    nameEn: 'Wild Critic',
    tags: ['反叛', '幽默', '颠覆'],
    tagline: '阅片量不多，但已经学会叛逆了。',
    description:
      '你是电影圈的"刚学会走就想跑"型选手。看的不多，但已经学会说"我觉得这部被高估了"。你看的低分片可能只是因为它名字听起来很酷。你的品味还在野蛮生长期，但至少已经开始有自己的声音了——虽然这个声音目前还有点跑调。在一次次的答题中，你慢慢摸索自己真正喜欢什么。',
    spiritDirector: '昆汀 / 盖·里奇 / 北野武',
    quote: '"我觉得《小丑》比《黑暗骑士》好。——你看的最后一部DC还是《新蝙蝠》"',
    recommendations: ['《两杆大烟枪》', '《花火》', '《上帝之城》', '《杀死比尔》'],
    color: '#ef4444',
    rarity: 'uncommon',
  },

  // ===== N-C-O-* 特色高分正统派 =====
  {
    id: 'NCOM',
    name: '学院派隐士',
    nameEn: 'Academy Hermit',
    tags: ['特色', '经典', '正统', '作者'],
    tagline: '冷门也要讲谱系，作者电影才是正统。',
    description:
      '你不满足于大众爆款，但你找"特色"不会乱来。你相信影史谱系和经得起时间考验的作品。你分得清导演的创作阶段和风格脉络，哪怕片子小众，也要有站得住的艺术地位。从导演对比到自我认知，你的选择始终冷静、有据、不求认同。你的片单像一份安静但严谨的电影课书单。',
    spiritDirector: '塔可夫斯基 / 伯格曼 / 费穆',
    quote: '"这部你没看过很正常，它只有两万人标记过。" ——没有炫耀的意思。',
    recommendations: ['《潜行者》', '《第七封印》', '《小城之春》', '《生之欲》'],
    color: '#78716c',
    rarity: 'rare',
  },
  {
    id: 'NCOS',
    name: '文艺入门者',
    nameEn: 'Indie Rookie',
    tags: ['特色', '经典', '文艺', '入门'],
    tagline: '开始深入了，方向还挺正。',
    description:
      '你开始对热门电影感到不满足，正往更特色、更文艺的方向探索。你还不是那种能报出电影史脉络的人，但已经会被高口碑、作者气质和细腻的作品吸引。你选得不野，甚至有点谨慎——不过这份谨慎让你很少踩雷。在价值观题里你表现出对深度内容的偏好，在情景题里你也显出更多耐心。',
    spiritDirector: '是枝裕和 / 侯孝贤 / 贾樟柯',
    quote: '"我昨天看了一部日本电影……叫《小偷家族》……你们看过吗？"',
    recommendations: ['《小偷家族》', '《童年往事》', '《小武》', '《海街日记》'],
    color: '#a8a29e',
    rarity: 'common',
  },
  {
    id: 'NCAM',
    name: '骨灰级迷影教皇',
    nameEn: 'Cinephile Pope',
    tags: ['特色', '经典', '独到', '迷影'],
    tagline: '没有人比你更懂电影——你的朋友圈是这么说的。',
    description:
      '你是朋友圈里的电影终极权威。你精准地绕过商业大片，挑出的全是大师的"非典型神作"。阅片量极大，能在16道混合题里从容识别每道题的指向。当你在导演对比题里选的不是"最出名"的那位，而是"最符合你审美体系"的那位，连题目设计者都忍不住点头。你开口推荐时，所有人都会掏出手机记片名。',
    spiritDirector: '安哲罗普洛斯 / 侯孝贤 / 阿彼察邦',
    quote: '"这部我前年看的，说实话不如导演之前那部，但结尾那个长镜头……绝了。"',
    recommendations: ['《雾中风景》', '《悲情城市》', '《能召回前世的布米叔叔》', '《一一》'],
    color: '#e879f9',
    rarity: 'legendary',
  },
  {
    id: 'NCAS',
    name: '潜力股影迷',
    nameEn: 'Potential Cinephile',
    tags: ['特色', '经典', '独到', '潜力'],
    tagline: '已经开始与众不同了，只差更多片单。',
    description:
      '你已经不满足于大众熟知的答案，会在导演对比和价值观题里主动选择更有作者气质的选项。你也在给定选项之外保留自己的偏好——"其他作品"选项就是你最后的倔强。你的判断还没有完全体系化，有时靠直觉，有时靠审美雷达，但方向很清楚：你正在离普通观众越来越远，离真正的影迷越来越近。',
    spiritDirector: '韦斯·安德森 / 贾樟柯 / 今敏',
    quote: '"《布达佩斯大饭店》的画面真的好美……不是，我说的是构图……"',
    recommendations: ['《布达佩斯大饭店》', '《世界》', '《千年女优》', '《花样年华》'],
    color: '#d8b4fe',
    rarity: 'uncommon',
  },

  // ===== N-G-O-* 特色低分派 =====
  {
    id: 'NGOM',
    name: '邪典考古学家',
    nameEn: 'Cult Archaeologist',
    tags: ['特色', '邪典', '正统', '考据'],
    tagline: '怪片也要讲谱系，邪典也有方法论。',
    description:
      '你喜欢冷门、怪异、评价两极的作品，但你不是随便猎奇。你会把邪典片、实验失败和作者脉络放在一起研究，试图从不稳定的作品里看见创作野心。在导演对比题里你选的往往是最"不对劲"的那位，在价值观题你坚定站在"独立判断"那一侧。你的片单像地下资料馆，正常人进去会迷路。',
    spiritDirector: '蔡明亮 / 费德里科·费里尼 / 罗伯特·布列松',
    quote: '"这部片豆瓣只有几百个人标记过……但我认为是神作。"',
    recommendations: ['《爱情万岁》', '《八部半》', '《扒手》', '《蚀》'],
    color: '#b45309',
    rarity: 'rare',
  },
  {
    id: 'NGOS',
    name: '好奇宝宝',
    nameEn: 'Curious Newbie',
    tags: ['特色', '邪典', '探索'],
    tagline: '你也不知道自己为什么选了这部，但感觉很有文化。',
    description:
      '你选了一些冷门作品，但坦白说你自己也不太确定它们好在哪。你只是觉得"选这个听起来比较有品味"。你正在经历一个可爱的阶段：看的片不多，但已经开始被"特色"这个标签吸引。不过别担心——在价值观和情景题里，你的选择已经开始显现出某种一致性了。你至少迈出了第一步。',
    spiritDirector: '（等你多看几部再来要精神导演）',
    quote: '"这片子……很……特别。你应该看看。" ——其实你也没太看懂。',
    recommendations: ['《路边野餐》', '《德州巴黎》', '《柏林苍穹下》', '《永恒和一日》'],
    color: '#92400e',
    rarity: 'common',
  },
  {
    id: 'NGAM',
    name: 'B级片挖掘机',
    nameEn: 'B-Movie Digger',
    tags: ['反叛', '颠覆', '暴力', '荒诞'],
    tagline: '你是正常人里的异端，异端里的教皇。',
    description:
      '你是一群奇葩（褒义）。你阅片无数，却偏爱大师翻车、邪典实验、评价两极的作品，并能从中解读出"这才是导演真正的表达"。你对"烂片"的标准和正常人不一样——你觉得《房间》是天才之作。在16道题里，你的选择总是最出人意料的那一个，连算法都为你多算了两秒。',
    spiritDirector: '拉斯·冯·提尔 / 三池崇史 / 大卫·林奇',
    quote: '"你们觉得这是烂片？你们根本不懂导演想表达什么。" ——然后你写了五千字分析。',
    recommendations: ['《房间》', '《切肤之爱》', '《圣山》', '《橡皮头》'],
    color: '#b91c1c',
    rarity: 'legendary',
  },
  {
    id: 'NGAS',
    name: '暗夜探索者',
    nameEn: 'Dark Explorer',
    tags: ['特色', '邪典', '实验'],
    tagline: '你知道的不多，但你已经走偏了。',
    description:
      '你是最让正常影迷困惑的存在。你知道的导演不多，但你知道的那几个都是些"不太对劲"的类型。你选的低分作品可能只是因为它看起来最"疯"。你的电影品味正在往一个不可预测的方向发展，没人知道它最后通向哪里——也许连导演本人也不知道。但你玩得很开心，这才是最重要的。',
    spiritDirector: '大卫·林奇 / 昆汀 / 北野武',
    quote: '"我最近看了一部电影，看完做了三天噩梦——挺好看的。"',
    recommendations: ['《穆赫兰道》', '《杀出个黎明》', '《大逃杀》', '《梦之安魂曲》'],
    color: '#881337',
    rarity: 'uncommon',
  },

  // ===== 边界情况：几乎没看过 =====
  {
    id: 'NEWBIE',
    name: '影坛白纸',
    nameEn: 'Cinema Rookie',
    tags: [],
    tagline: '勇敢承认自己没看过，也是一种态度。',
    description:
      '你在这 16 道题里几乎都没看过/答不上来。说实话，你能坚持做完已经很了不起了！你的电影知识储备像一张白纸——但也正因为是白纸，你可以画出任何东西。建议收藏这个测试，刷完 50 部经典再回来测一次。',
    spiritDirector: '（建议从张艺谋开始补起）',
    quote: '"这个导演……是拍什么的来着？"',
    recommendations: ['《霸王别姬》', '《千与千寻》', '《肖申克的救赎》', '《功夫》'],
    color: '#6b7280',
    rarity: 'common',
  },
]

/**
 * 根据四个维度的得分，找到最匹配的 DBTI 类型。
 */
export function matchDBTIType(scores: Record<string, number>): DBTIType {
  const p = scores.p ?? 0
  const n = scores.n ?? 0
  const c = scores.c ?? 0
  const g = scores.g ?? 0
  const o = scores.o ?? 0
  const a = scores.a ?? 0
  const m = scores.m ?? 0
  const s = scores.s ?? 0

  const dim1 = p >= n ? 'P' : 'N'
  const dim2 = c >= g ? 'C' : 'G'
  const dim3 = o >= a ? 'O' : 'A'
  const dim4 = m > s ? 'M' : 'S'

  const code = `${dim1}${dim2}${dim3}${dim4}`
  const found = DBTI_TYPES.find((t) => t.id === code)
  return found ?? DBTI_TYPES[0]
}

/**
 * 获取四个维度的字母标签。
 */
export function getDimensionLabels(code: string) {
  const d1 = code[0] === 'P' ? { letter: 'P', label: '大众型', desc: '主流审美的拥抱者。' }
    : { letter: 'N', label: '特色型', desc: '冷门佳品的挖掘者。' }
  const d2 = code[1] === 'C' ? { letter: 'C', label: '经典高分型', desc: '相信评分体系的可靠标尺。' }
    : { letter: 'G', label: '邪典低分型', desc: '能在烂片里品出独特乐趣。' }
  const d3 = code[2] === 'O' ? { letter: 'O', label: '正统标准型', desc: '认同主流对作品的共识判断。' }
    : { letter: 'A', label: '独到反思型', desc: '偏爱导演非典型的一面。' }
  const d4 = code[3] === 'M' ? { letter: 'M', label: '核心影迷', desc: '阅片量惊人的深度影迷。' }
    : { letter: 'S', label: '随性轻度', desc: '观影更随缘的娱乐派。' }
  return [d1, d2, d3, d4]
}
