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
    tagline: '你的片单就是颁奖季的获奖名单',
    description:
      '你只选最出名、评分最高的代表作，而且几乎认识所有导演。你的电影品味是教科书级别的——安全、正统、无懈可击。跟你聊电影很安心，因为你知道的不会太差，但也不会太野。朋友问你推荐电影，你毫不犹豫说出三部豆瓣TOP10，然后收获一片认同的点头。',
    spiritDirector: '斯皮尔伯格 / 李安 / 诺兰',
    quote: '"这部拿了奥斯卡最佳影片，应该不错。" ——你的选片标准',
    recommendations: ['《辛德勒的名单》', '《霸王别姬》', '《肖申克的救赎》', '《断背山》'],
    color: '#f59e0b',
    rarity: 'common',
  },
  {
    id: 'PCOS',
    name: '大众评审',
    nameEn: 'Mainstream Jury',
    tags: ['商业', '大众', '叙事'],
    tagline: '看片只看出名的，评分只看高的',
    description:
      '你平时不太有空看电影，所以选的时候非常精准——只挑导演最爆的那部。你没看过什么冷门片，但你也不需要。你跟朋友聊电影时总能接上话，因为你挑的都是大家都看过的。你不是影迷，你是社交型观影者。',
    spiritDirector: '诺兰 / 卡梅隆 / 周星驰',
    quote: '"《星际穿越》？哦那个我看过！" ——你的观影代表作',
    recommendations: ['《盗梦空间》', '《阿凡达》', '《喜剧之王》', '《泰坦尼克号》'],
    color: '#d97706',
    rarity: 'common',
  },
  {
    id: 'PCAM',
    name: '精英鉴赏家',
    nameEn: 'Elite Connoisseur',
    tags: ['大众', '经典', '独到', '大师'],
    tagline: '大众经典你都懂，但答案不一定照着给',
    description:
      '你熟悉导演最被认可的代表作，也认同经典体系的价值，但你并不满足于标准答案。你会看大众名片，也会在关键时刻说出“我其实更喜欢另一部”。你的品味不靠冷门来炫耀，而是在主流经典里保留自己的判断。你能和普通观众聊得起来，也能和影迷认真争两句。',
    spiritDirector: '库布里克 / 大卫·芬奇 / 诺兰',
    quote: '"《肖申克》是好，但他最好的其实是《迷雾》...等一下我只是举个例子"',
    recommendations: ['《失眠症》', '《断锁怒潮》', '《本杰明·巴顿奇事》', '《致命魔术》'],
    color: '#8b5cf6',
    rarity: 'uncommon',
  },
  {
    id: 'PCAS',
    name: '品味新贵',
    nameEn: 'Taste Upstart',
    tags: ['大众', '经典', '独到', '入门'],
    tagline: '刚入坑，但已经开始有自己的答案',
    description:
      '你入电影坑的时间不长，但不是完全跟着榜单走。你知道那些最出名、最安全的经典，也开始意识到自己会被某些非标准答案吸引。你还没有形成很完整的片单体系，但已经会在朋友推荐热门片时小声补一句：“我好像更喜欢另一种感觉。”方向是对的，继续看片。',
    spiritDirector: '昆汀 / 大卫·芬奇 / 姜文',
    quote: '"我才看完《搏击俱乐部》...我觉得它讲的是...嗯...资本主义？"',
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
    tagline: '主流片你认，评分不重要，爽就完了',
    description:
      '你对导演的认识很主流：谁拍过哪部热门片，你基本知道。但你的评价标准不完全跟评分走，哪怕口碑一般，只要节奏够快、场面够爽、情绪给到位，你就愿意买账。你不是为了反叛而喜欢争议片，你只是觉得电影首先应该好看、好笑、够刺激。',
    spiritDirector: '周星驰 / 迈克尔·贝 / 宁浩',
    quote: '"豆瓣评分才6.5？我觉得挺好看的啊！" ——你的日常',
    recommendations: ['《功夫》', '《疯狂的赛车》', '《变形金刚1》', '《唐人街探案》'],
    color: '#f97316',
    rarity: 'common',
  },
  {
    id: 'PGOS',
    name: '快乐看客',
    nameEn: 'Happy Viewer',
    tags: ['大众', '娱乐', '商业'],
    tagline: '看电影就图一乐，导演标签够熟就行',
    description:
      '你看电影的动机很简单：放松、开心、别太累。你大多认识导演最主流的一面，也会被商业片、喜剧片、动作场面吸引。你不太会深挖导演风格，更不会为了证明品味去看难懂的片。你不是资深影迷，但你的观影体验很诚实：好玩就是好。',
    spiritDirector: '（你没啥精神导演，开心就好）',
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
    tagline: '高分的你嫌俗，低分的你看出花来了',
    description:
      '你是那种会为一部4.2分的电影写三千字辩护长文的人。你觉得大众评分是狗屎，真正的宝藏都藏在争议区。你最爱导演翻车的作品——因为翻车才能暴露一个导演最真实的野心。你的辩友都怕你："你又要说《某某某》其实是神作了对吧？"',
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
    tagline: '阅片量不多，但已经学会叛逆了',
    description:
      '你是电影圈的"刚学会走就想跑"型选手。看了没几部电影，但已经学会说"我觉得这部被高估了"。你看的低分片可能纯粹是因为它名字听起来很酷。你的品味还在野蛮生长期，但至少已经开始有自己的声音了。虽然这个声音目前还有点跑调。',
    spiritDirector: '昆汀 / 盖·里奇 / 北野武',
    quote: '"我觉得《小丑》比《黑暗骑士》好。——你看的上一部DC还是《新蝙蝠侠》"',
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
    tagline: '冷门也要有谱系，作者电影才是正统',
    description:
      '你不满足于大众代表作，但你的“特色”不是乱选。你更相信影史谱系、作者脉络和经过时间筛选的高质量作品。你会认真区分导演阶段、风格转向和经典地位，哪怕片子不大众，也要站得住。你的片单像一份安静但严谨的电影课书单。',
    spiritDirector: '塔可夫斯基 / 伯格曼 / 费穆',
    quote: '"这部你没看过很正常，它只有两万人标记过。" ——你说这话时没有炫耀的意思',
    recommendations: ['《潜行者》', '《第七封印》', '《小城之春》', '《生之欲》'],
    color: '#78716c',
    rarity: 'rare',
  },
  {
    id: 'NCOS',
    name: '文艺入门者',
    nameEn: 'Indie Rookie',
    tags: ['特色', '经典', '文艺', '入门'],
    tagline: '刚开始探索特色圈，但方向还挺正',
    description:
      '你开始对热门电影感到不满足，正在往更特色、更文艺的方向探索。你还不是那种能熟练报出电影史脉络的人，但会天然被高口碑、作者气质和温柔细腻的作品吸引。你选得不野，甚至有点谨慎，不过这份谨慎让你很少踩雷。',
    spiritDirector: '是枝裕和 / 侯孝贤 / 贾樟柯',
    quote: '"我昨天看了一部日本电影...叫《小偷家族》...你们看过吗？" ——你骄傲地说',
    recommendations: ['《小偷家族》', '《童年往事》', '《小武》', '《海街日记》'],
    color: '#a8a29e',
    rarity: 'common',
  },
  {
    id: 'NCAM',
    name: '骨灰级迷影教皇',
    nameEn: 'Cinephile Pope',
    tags: ['特色', '经典', '独到', '迷影'],
    tagline: '没有人比你更懂电影——你的朋友圈是这么说的',
    description:
      '你是电影朋友圈里的终极权威。你看不上好莱坞商业大片，精准地避开了所有大众流行款，挑出的全是大师的"非典型特色神作"。阅片量极大，在豆瓣上写过几万字的长评。当你开口推荐电影时，在场的所有人都会拿出手机记下片名。你知道这是一种责任，也是一种孤独。',
    spiritDirector: '安哲罗普洛斯 / 侯孝贤 / 阿彼察邦',
    quote: '"这部我前年看的，说实话不如导演之前那部，但结尾那个长镜头...绝了。"',
    recommendations: ['《雾中风景》', '《悲情城市》', '《能召回前世的布米叔叔》', '《一一》'],
    color: '#e879f9',
    rarity: 'legendary',
  },
  {
    id: 'NCAS',
    name: '潜力股影迷',
    nameEn: 'Potential Cinephile',
    tags: ['特色', '经典', '独到', '潜力'],
    tagline: '你已经开始与众不同了，只差更多片单支撑',
    description:
      '你已经不满足于大众熟知的答案，会主动选择更特色、更有作者气质的作品，也会在给定选项之外保留自己的偏好。你的判断还没有完全体系化，有时靠直觉，有时靠审美雷达，但方向很清楚：你正在离普通观众越来越远，离真正的影迷越来越近。',
    spiritDirector: '韦斯·安德森 / 贾樟柯 / 今敏',
    quote: '"《布达佩斯大饭店》的画面真的好美...不是，我说的不是这个意思..."',
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
    tagline: '怪片也要讲谱系，邪典也有方法论',
    description:
      '你喜欢冷门、怪异、评价两极的作品，但你不是随便猎奇。你会把邪典片、失败实验和导演脉络放在一起研究，试图从不稳定的作品里看见创作野心。你对主流经典没那么感冒，却很在意一部怪片在类型史、作者谱系里的位置。你的片单像地下资料馆，正常人进去会迷路。',
    spiritDirector: '蔡明亮 / 费德里科·费里尼 / 罗伯特·布列松',
    quote: '"这部片在豆瓣只有几百个人标记过......但我觉得是神作。"',
    recommendations: ['《爱情万岁》', '《八部半》', '《扒手》', '《蚀》'],
    color: '#b45309',
    rarity: 'rare',
  },
  {
    id: 'NGOS',
    name: '好奇宝宝',
    nameEn: 'Curious Newbie',
    tags: ['特色', '邪典', '探索'],
    tagline: '你也不知道自己为什么选了这部，但感觉很有文化',
    description:
      '你选了一些冷门作品，但坦白说你自己也不太确定它们好在哪。你只是觉得"选这个听起来比较有品味"。你正在经历一个可爱的阶段：看的片不多，但已经开始被"特色"这个标签吸引了。虽然你的品味目前还是在装逼和真香之间反复横跳，但你至少迈出了第一步。',
    spiritDirector: '（等你多看几部冷门片再来要精神导演）',
    quote: '"这片子...很...特别。你应该看看。" ——其实你也没太看懂',
    recommendations: ['《路边野餐》', '《德州巴黎》', '《柏林苍穹下》', '《永恒和一日》'],
    color: '#92400e',
    rarity: 'common',
  },
  {
    id: 'NGAM',
    name: 'B级片挖掘机',
    nameEn: 'B-Movie Digger',
    tags: ['反叛', '颠覆', '暴力', '荒诞'],
    tagline: '你是正常人里的异端，异端里的教皇',
    description:
      '你是一群奇葩（褒义）。你阅片无数，却偏爱大师们翻车的、邪典的、实验性失败的低分作品，并能从中解读出"这才是导演真正的表达"。你对"烂片"的标准和正常人不一样——你觉得《房间》是天才之作。你的影评写着"这部电影的失败本身就是一种成功"。你让所有正常影迷感到困惑。',
    spiritDirector: '拉莫斯·冯·提尔 / 三池崇史 / 大卫·林奇',
    quote: '"你们觉得这是烂片？你们根本不懂导演想表达什么。" ——然后你写了五千字分析',
    recommendations: ['《房间》', '《切肤之爱》', '《圣山》', '《橡皮头》'],
    color: '#b91c1c',
    rarity: 'legendary',
  },
  {
    id: 'NGAS',
    name: '暗夜探索者',
    nameEn: 'Dark Explorer',
    tags: ['特色', '邪典', '实验'],
    tagline: '你知道的不多，但你已经走偏了',
    description:
      '你是最让正常影迷感到困惑的群体。你知道的导演不多，但你知道的那几个都是些"不太对劲"的——昆汀、大卫·林奇之类的。你选的低分作品可能只是因为它看起来最"疯"。你的电影品味正在往一个不可预测的方向发展，没人知道它最终会通向哪里，包括你自己。',
    spiritDirector: '大卫·林奇 / 昆汀 / 北野武',
    quote: '"我最近看了一部电影，看完之后我做了三天噩梦——挺好看的。"',
    recommendations: ['《穆赫兰道》', '《杀出个黎明》', '《大逃杀》', '《梦之安魂曲》'],
    color: '#881337',
    rarity: 'uncommon',
  },
]

// ===== 触发式特殊人格（覆盖16型） =====
export const TRIGGER_TYPES: DBTIType[] = [
  {
    id: 'NEWBIE',
    name: '影坛白纸',
    nameEn: 'Cinema Rookie',
    tags: [],
    tagline: '勇敢承认自己没看过，也是一种态度',
    description:
      '你在这10道题里，超过一半选了"没看过"。说实话，你能坚持做完这个测试已经很了不起了。你的电影知识储备相当于一张白纸——但也正因为是白纸，你可以画出任何东西！建议你收藏这个测试页面，等你刷完100部电影再回来重新测一次。',
    spiritDirector: '（建议从张艺谋开始补起）',
    quote: '"这个导演...是拍什么的来着？"',
    recommendations: ['《霸王别姬》', '《千与千寻》', '《肖申克的救赎》', '这个测试页面'],
    color: '#6b7280',
    rarity: 'common',
  },
  {
    id: 'NBC',
    name: '牛逼克拉斯',
    nameEn: 'NBC',
    tags: [],
    tagline: '你知道的还没不知道的多',
    description:
      '你选的10位导演里有将近一半你都没听说过。牛逼克拉斯——不是说你牛逼，是说你的无知程度有点牛逼。不过换个角度看，你还有好多好电影没看，这不也是一种幸福吗？',
    spiritDirector: '（连导演都不认识还要什么精神导演）',
    quote: '"这个导演是谁？"',
    recommendations: ['从豆瓣TOP250开始', '先把张艺谋认全', '诺兰总该知道吧'],
    color: '#a16207',
    rarity: 'common',
  },
  {
    id: 'CROWD',
    name: '跟风大队',
    nameEn: 'Crowd Follower',
    tags: ['商业', '大众'],
    tagline: '哪部火你选哪部',
    description:
      '你几乎每题都选了最出名的那部电影。你不只是在追随主流——你就是热搜本搜。你的选片标准简单粗暴：朋友圈有人发了吗？豆瓣评分过8了吗？票房过10亿了吗？都满足了？好，那就是它了。',
    spiritDirector: '（你不需要精神导演，微博热搜就是你的导演）',
    quote: '"最近大家都在看什么？"',
    recommendations: ['试试不看出名的那部', '特色片也有好东西', '走出信息茧房'],
    color: '#0e7490',
    rarity: 'uncommon',
  },
  {
    id: 'OLDPEOPLE',
    name: '怀旧老人',
    nameEn: 'Old People',
    tags: ['古典', '传统', '大师'],
    tagline: '不是老片你不看，你是电影界的考古学家',
    description:
      '你有一个惊人的能力：每次从导演的作品里选，你都能精准地选出最早的那一部。你脑子里像是内置了一个时间轴，永远指向"越早越好"。你是朋友圈里唯一一个会为了"哪个版本画幅比更正确"而跟人吵架的人。',
    spiritDirector: '小津安二郎 / 费穆 / 黑泽明',
    quote: '"这片子我只认1954年的原版"',
    recommendations: ['《东京物语》', '《小城之春》', '《罗生门》', '《七武士》'],
    color: '#78716c',
    rarity: 'rare',
  },
]

/**
 * 根据四个维度的得分，找到最匹配的 DBTI 类型。
 *
 * @param scores - { p, n, c, g, o, a, m, s } 各维度的原始得分
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
  const d1 = code[0] === 'P' ? { letter: 'P', label: '大众型', desc: '主流审美的拥抱者' }
    : { letter: 'N', label: '特色型', desc: '冷门佳片的挖掘机' }
  const d2 = code[1] === 'C' ? { letter: 'C', label: '经典高分型', desc: '非高分不看的完美主义者' }
    : { letter: 'G', label: '邪典低分型', desc: '能从烂片里品出乐子' }
  const d3 = code[2] === 'O' ? { letter: 'O', label: '正统标准型', desc: '认同大众对导演的定义' }
    : { letter: 'A', label: '独到反思型', desc: '喜欢导演的非典型作品' }
  const d4 = code[3] === 'M' ? { letter: 'M', label: '核心影迷', desc: '阅片量惊人的拉片狂魔' }
    : { letter: 'S', label: '随性轻度', desc: '看电影更随缘的娱乐派' }
  return [d1, d2, d3, d4]
}
