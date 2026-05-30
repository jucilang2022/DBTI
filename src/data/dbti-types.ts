import type { DBTIType } from '@/types'

/**
 * DBTI 16 型人格 — MBTI × 豆瓣影迷
 *
 * 四维字母：
 *   维度一   P (Popular) 大众  vs  N (Niche) 小众
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
    tags: ['叙事', '视觉', '大师', '戏剧'],
    tagline: '大众爆款你看，但你有自己的品味倔强',
    description:
      '你看过所有热门电影，但你最喜欢的永远是那些被低估的"其他作品"。你为斯皮尔伯格的《断锁怒潮》而不是《侏罗纪公园》辩护，你觉得诺兰最好的电影是《失眠症》。你在大众和独到之间走钢丝，既享受和别人聊天的共鸣，又坚持自己的一点骄傲。',
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
    tags: ['叙事', '视觉', '情感'],
    tagline: '刚入坑但已经学会说"其实我觉得..."',
    description:
      '你入电影坑的时间不长，但有在认真培养品味。你知道最出名的那些电影，也开始学着欣赏"其他作品"。你会在朋友说《教父》是史上最伟大的电影时，小心翼翼地补一句"但是《美国往事》也不错..."。方向是对的，继续努力。',
    spiritDirector: '昆汀 / 大卫·芬奇 / 姜文',
    quote: '"我才看完《搏击俱乐部》...我觉得它讲的是...嗯...资本主义？"',
    recommendations: ['《搏击俱乐部》', '《美国往事》', '《消失的爱人》', '《低俗小说》'],
    color: '#a78bfa',
    rarity: 'common',
  },

  // ===== P-G-O-* 大众低分派 =====
  {
    id: 'PGOM',
    name: '爆米花国王',
    nameEn: 'Popcorn King',
    tags: ['商业', '娱乐', '动作', '幽默'],
    tagline: '评分不重要，爽就完了',
    description:
      '你知道那部电影评分不高，但你看得真的很开心。你是那种在电影院会因为一个烂梗笑得最大声的人。你选导演的低分片子不是因为你叛逆——你是真的觉得"没评分说的那么差啊"。你的观影信条：电影首先是娱乐。',
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
    tags: ['娱乐', '幽默', '商业'],
    tagline: '看电影就图一乐，别跟我谈艺术',
    description:
      '你入坑电影的动机很简单：开心。你不在意评分，不在意导演是谁，电影好笑的、动作帅的就是好片。你对导演的认知基本停留在"拍过那部我喜欢的"。你一年看不了几部电影，但每一部都看得很投入。这种纯粹挺好的。',
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
      '你是那种会为一部4.2分的电影写三千字辩护长文的人。你觉得大众评分是狗屎，真正的宝藏都藏在低分区。你最爱导演翻车的作品——因为翻车才能暴露一个导演最真实的野心。你的辩友都怕你："你又要说《某某某》其实是神作了对吧？"',
    spiritDirector: '拉斯·冯·提尔 / 三池崇史 / 大卫·林奇',
    quote: '"你们都说这是导演最烂的作品？我觉得这是他最真诚的一次。"',
    recommendations: ['《女性瘾者》', '《杀手阿一》', '《沙丘(1984)》', '《地球最后的夜晚》'],
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

  // ===== N-C-O-* 小众高分正统派 =====
  {
    id: 'NCOM',
    name: '学院派隐士',
    nameEn: 'Academy Hermit',
    tags: ['古典', '大师', '叙事', '戏剧'],
    tagline: '你看的冷门片都是高分，这就是实力',
    description:
      '你是电影社里那个不怎么说话但一开口就让人沉默的人。你知道大量高分冷门片，每一部都是精品。你的片单里没有烂片，因为你会做功课才看。你对导演的了解不止于代表作——你会把他们拉到豆瓣片单里一部部对比。你话不多，但你的豆瓣片单会说话。',
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
    tags: ['文艺', '叙事', '古典'],
    tagline: '刚开始探索小众圈，已经找到组织了',
    description:
      '你开始对热门电影感到不满足了，正在探索更广阔的天地。你发现原来世界上还有"小众高分"这种东西——评分高但你从没听说过。你觉得自己打开了一扇新世界的大门，有点兴奋也有点慌。坚持下去，你很快就能成为朋友们眼中"那个很懂的人"。',
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
    tags: ['视听', '大师', '叙事', '文艺', '诗意'],
    tagline: '没有人比你更懂电影——你的朋友圈是这么说的',
    description:
      '你是电影朋友圈里的终极权威。你看不上好莱坞商业大片，精准地避开了所有大众流行款，挑出的全是大师的"非典型小众神作"。阅片量极大，在豆瓣上写过几万字的长评。当你开口推荐电影时，在场的所有人都会拿出手机记下片名。你知道这是一种责任，也是一种孤独。',
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
    tags: ['文艺', '大师', '视觉'],
    tagline: '你已经开始与众不同了，还差一点阅片量',
    description:
      '你已经学会跳过评分最高的那部，去选导演更特别的作品。你对"小众佳片"和"其他作品"有自己的偏好。不过你对导演的了解还不深，有些选对了纯粹是直觉好——或者说运气好。你的品味潜力巨大，再刷200部电影你就可以挑战"教皇"了。',
    spiritDirector: '韦斯·安德森 / 贾樟柯 / 今敏',
    quote: '"《布达佩斯大饭店》的画面真的好美...不是，我说的不是这个意思..."',
    recommendations: ['《布达佩斯大饭店》', '《世界》', '《千年女优》', '《花样年华》'],
    color: '#d8b4fe',
    rarity: 'uncommon',
  },

  // ===== N-G-O-* 小众低分派 =====
  {
    id: 'NGOM',
    name: '邪典考古学家',
    nameEn: 'Cult Archaeologist',
    tags: ['古典', '小众', '心理学'],
    tagline: '你挖出来的片子，豆瓣评分人数都不超过四位数',
    description:
      '你是那种能在豆瓣"冷门佳作"标签下翻到第八页的人。你选的片子很多连评分都没满——不是分低，是打分的人太少。你是电影考古学的实践者，坚信好片不一定出名，出名的也不一定是好片。你的片单是其他影迷的藏宝图。',
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
    tags: ['探索', '冷门', '文艺'],
    tagline: '你也不知道自己为什么选了这部，但感觉很有文化',
    description:
      '你选了一些冷门作品，但坦白说你自己也不太确定它们好在哪。你只是觉得"选这个听起来比较有品味"。你正在经历一个可爱的阶段：看的片不多，但已经开始被"小众"这个标签吸引了。虽然你的品味目前还是在装逼和真香之间反复横跳，但你至少迈出了第一步。',
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
    recommendations: ['《房间》', '《切肤之爱》', '《穆赫兰道》', '《搏击俱乐部》'],
    color: '#b91c1c',
    rarity: 'legendary',
  },
  {
    id: 'NGAS',
    name: '暗夜探索者',
    nameEn: 'Dark Explorer',
    tags: ['荒诞', '暴力', '实验'],
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
    recommendations: ['试试不看出名的那部', '小众片也有好东西', '走出信息茧房'],
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
  const dim4 = m > s ? 'M' : (s > m ? 'S' : (m === 0 && s === 0 ? 'S' : 'M'))

  const code = `${dim1}${dim2}${dim3}${dim4}`
  const found = DBTI_TYPES.find((t) => t.id === code)
  return found ?? DBTI_TYPES[0]
}

/**
 * 获取四个维度的字母标签。
 */
export function getDimensionLabels(code: string) {
  const d1 = code[0] === 'P' ? { letter: 'P', label: '大众型', desc: '主流审美的拥抱者' }
    : { letter: 'N', label: '小众型', desc: '冷门佳片的挖掘机' }
  const d2 = code[1] === 'C' ? { letter: 'C', label: '经典高分型', desc: '非高分不看的完美主义者' }
    : { letter: 'G', label: '邪典低分型', desc: '能从烂片里品出乐子' }
  const d3 = code[2] === 'O' ? { letter: 'O', label: '正统标准型', desc: '认同大众对导演的定义' }
    : { letter: 'A', label: '独到反思型', desc: '喜欢导演的非典型作品' }
  const d4 = code[3] === 'M' ? { letter: 'M', label: '核心影迷', desc: '阅片量惊人的拉片狂魔' }
    : { letter: 'S', label: '随性轻度', desc: '看电影更随缘的娱乐派' }
  return [d1, d2, d3, d4]
}
