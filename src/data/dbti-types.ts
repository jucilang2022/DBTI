import type { DBTIType } from '@/types'

/**
 * DBTI 16 型人格 — MBTI × 豆瓣影迷
 *
 * 四维字母：
 *   维度一   P (Popular) 大众  vs  N (Niche) 特色
 *   维度二   C (Canonical) 经典高分  vs  G (Guilty-pleasure) 邪典争议
 *   维度三   O (Orthodox) 正统  vs  A (Alternative) 独到
 *   维度四   M (Cinephile) 核心影迷  vs  S (Spontaneous) 随性轻度
 */

export const DBTI_TYPES: DBTIType[] = [
  // ===== P-C-O-* 大众经典正统派 =====
  {
    id: 'PCOM',
    name: '奥斯卡风向标',
    nameEn: 'Awards Tracker',
    tags: ['大众', '经典', '正统', '迷影'],
    tagline: '你的片单，就是颁奖季的获奖名单。',
    description:
      '你选片稳、准、狠——要么是导演公认的代表作，要么是经过时间验证的高分经典。你信任主流口碑和权威榜单，但这不是盲从，而是你有一套成熟的判断体系。你会追热门，也会研究为什么它能拿奖；和朋友聊电影时，你是那个能说出「最佳影片」背后逻辑的人。',
    spiritDirector: '斯皮尔伯格 / 李安 / 诺兰',
    quote: '"拿了最佳影片，应该错不了。"',
    recommendations: ['《辛德勒的名单》', '《霸王别姬》', '《肖申克的救赎》', '《断背山》'],
    color: '#f59e0b',
    rarity: 'common',
  },
  {
    id: 'PCOS',
    name: '大众评审',
    nameEn: 'Mainstream Jury',
    tags: ['大众', '经典', '正统', '轻度'],
    tagline: '看得不多，但每部都是热门高分。',
    description:
      '你没有太多时间泡在影展和论坛里，但选片非常务实——只挑最出名、讨论度最高、评分最稳的那一批。你可能说不出导演的风格脉络，但热门榜单上的片子你大多看过，而且你的结论很诚实：高分就是好，大家都看的就是值得看。你不装懂，也不跟风踩片，看电影就是生活里的一个可靠选项。',
    spiritDirector: '诺兰 / 卡梅隆 / 周星驰',
    quote: '"《星际穿越》？哦那个我看过，挺烧脑的。"',
    recommendations: ['《盗梦空间》', '《阿凡达》', '《喜剧之王》', '《泰坦尼克号》'],
    color: '#d97706',
    rarity: 'common',
  },
  {
    id: 'PCAM',
    name: '精英鉴赏家',
    nameEn: 'Elite Connoisseur',
    tags: ['大众', '经典', '独到', '迷影'],
    tagline: '主流经典你都懂，但你会给出自己的答案。',
    description:
      '你熟悉大众审美和经典体系，却不机械地按榜单选片。你认同大部分公认好片，也会在关键时刻坚持自己的偏好——可能更爱导演的非代表作，或在两部热门之间选出冷门的那一位。你既能和普通观众聊得来，也能在迷影讨论里给出有分量的观点。你的品味有体系，也有棱角。',
    spiritDirector: '库布里克 / 大卫·芬奇 / 诺兰',
    quote: '"《肖申克》是好片，但我心里最好的不一定是它。"',
    recommendations: ['《闪灵》', '《七宗罪》', '《本杰明·巴顿奇事》', '《致命魔术》'],
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
      '你看电影的时间不算长，但已经走出「只看榜单前几名」的阶段。你知道那些公认的经典，也开始被某些不那么标准的选项吸引——一部口碑分裂的商业片、一个你叫不出全名的导演。你的体系还没完全成型，有时靠直觉，有时靠朋友安利，但方向很清楚：你正在从观众变成有偏好的人。',
    spiritDirector: '昆汀 / 大卫·芬奇 / 姜文',
    quote: '"我才看完《搏击俱乐部》……我觉得它讲的应该是……嗯，消费主义？"',
    recommendations: ['《搏击俱乐部》', '《低俗小说》', '《消失的爱人》', '《让子弹飞》'],
    color: '#a78bfa',
    rarity: 'common',
  },

  // ===== P-G-* 大众争议派 =====
  {
    id: 'PGOM',
    name: '爆米花国王',
    nameEn: 'Popcorn King',
    tags: ['大众', '争议', '正统', '迷影'],
    tagline: '评分是参考，爽才是标准。',
    description:
      '你是类型片的常客——动作、喜剧、科幻、大片——对热门导演和工业套路如数家珍。你不迷信高分，但也不为了标新立异而标新立异：一部片只要节奏对、场面到位、情绪给足，你就愿意买单。你看得够多，能聊场面对标和系列脉络，只是你的评价体系和文艺片影迷不在同一个频道。',
    spiritDirector: '周星驰 / 迈克尔·贝 / 宁浩',
    quote: '"豆瓣6.5？我觉得挺好看的啊，你们要求太高了吧。"',
    recommendations: ['《功夫》', '《变形金刚》', '《疯狂的赛车》', '《碟中谍6》'],
    color: '#f97316',
    rarity: 'common',
  },
  {
    id: 'PGOS',
    name: '快乐看客',
    nameEn: 'Happy Viewer',
    tags: ['大众', '争议', '正统', '轻度'],
    tagline: '看电影就图一乐，别整太复杂。',
    description:
      '你把电影当放松方式，不需要什么高深的理由。热门大制作、商业喜剧、动作爽片——你认识的导演可能就那么几位，但这完全不妨碍你看得开心。你不跟低分片较劲，也不参与「这片被高估了吗」的辩论。你的标准很简单：当下看得投入、出来觉得值回票价，就是好片。',
    spiritDirector: '周星驰 / 开心麻花 / 大鹏',
    quote: '"我感觉挺好的啊，他们为什么分那么低？"',
    recommendations: ['《夏洛特烦恼》', '《西虹市首富》', '《捉妖记》', '《人在囧途》'],
    color: '#fb923c',
    rarity: 'common',
  },
  {
    id: 'PGAM',
    name: '主流逆鳞',
    nameEn: 'Mainstream Maverick',
    tags: ['大众', '争议', '独到', '迷影'],
    tagline: '热门导演的小众口味，专挑最受争议的那部。',
    description:
      '你认识的大导演不少，但你的偏好总在「主流」和「跑偏」之间——诺兰粉丝却最爱《信条》被喷的部分，姜文影迷反而沉迷《一步之遥》。你不是为了反主流而反主流，而是在熟悉的工业体系里，专门挖掘那些被讨论、被误解、被两极评价的作品，并认真为之辩护。你是大众语境里的异类，但异类得很有论据。',
    spiritDirector: '诺兰 / 姜文 / 王家卫',
    quote: '"《信条》被喷成那样，我觉得恰恰是诺兰最冒险的一次。"',
    recommendations: ['《信条》', '《一步之遥》', '《摆渡人》', '《无极》'],
    color: '#dc2626',
    rarity: 'uncommon',
  },
  {
    id: 'PGAS',
    name: '野生评论家',
    nameEn: 'Wild Critic',
    tags: ['大众', '争议', '独到', '轻度'],
    tagline: '看得不多，但已经学会唱反调。',
    description:
      '你是那种「刚学会走就想跑」的观影者。总量不大，但已经会在热门片下面留下「我觉得被高估了」的评论。你看的争议片有时只是因为片名酷、海报怪，或者朋友强烈推荐。你的品味还在野蛮生长期，声音偶尔跑调，但至少你已经不满足于只说好或不好了——你在摸索自己到底站在哪一边。',
    spiritDirector: '昆汀 / 盖·里奇 / 北野武',
    quote: '"《小丑》比《黑暗骑士》好。——等等，我上一部 DC 看的啥来着？"',
    recommendations: ['《两杆大烟枪》', '《花火》', '《小丑》', '《杀死比尔》'],
    color: '#ef4444',
    rarity: 'uncommon',
  },

  // ===== N-C-O-* 特色经典正统派 =====
  {
    id: 'NCOM',
    name: '学院派隐士',
    nameEn: 'Academy Hermit',
    tags: ['特色', '经典', '正统', '迷影'],
    tagline: '冷门也要讲谱系，作者电影才是正统。',
    description:
      '你不满足于大众爆款，但找「特色」不会乱来。你相信影史谱系和经得起时间考验的作品，分得清导演的创作阶段和风格脉络。哪怕片子小众、标记人数少，你也要求它有站得住的艺术位置。你的片单像一份安静但严谨的书单，不炫耀，但每一部都有来头。',
    spiritDirector: '塔可夫斯基 / 伯格曼 / 费穆',
    quote: '"这部你没看过很正常，它标记人才两万多。"',
    recommendations: ['《潜行者》', '《第七封印》', '《小城之春》', '《生之欲》'],
    color: '#78716c',
    rarity: 'rare',
  },
  {
    id: 'NCOS',
    name: '文艺入门者',
    nameEn: 'Indie Rookie',
    tags: ['特色', '经典', '正统', '轻度'],
    tagline: '开始往深处走，方向还挺正。',
    description:
      '你开始觉得热门片不够用了，正往更文艺、更作者的方向探索。你还不是能报影史脉络的大神，但已经被高口碑、细腻气质和「有点门槛」的作品吸引。你选片偏谨慎，很少为了猎奇而猎奇——这份谨慎让你踩雷不多，也让你稳步离开纯大众审美区。',
    spiritDirector: '是枝裕和 / 侯孝贤 / 贾樟柯',
    quote: '"我昨天看了部日本片……《小偷家族》……你们看过吗？"',
    recommendations: ['《小偷家族》', '《童年往事》', '《小武》', '《海街日记》'],
    color: '#a8a29e',
    rarity: 'common',
  },
  {
    id: 'NCAM',
    name: '骨灰级迷影',
    nameEn: 'Cinephile Pope',
    tags: ['特色', '经典', '独到', '迷影'],
    tagline: '朋友圈里的电影终极权威——他们自己说的。',
    description:
      '你精准绕过纯商业爆款，挑出的多是大师的非典型神作或冷门高峰。阅片量大，审美体系完整，能在讨论里迅速定位一部片的作者脉络和时代背景。你推荐片名时，朋友会下意识掏手机记。你不一定爱炫，但你的偏好确实比大多数人更细、更深、更难复制。',
    spiritDirector: '安哲罗普洛斯 / 侯孝贤 / 阿彼察邦',
    quote: '"这部我前年看的，不如导演前作，但结尾那个长镜头……绝了。"',
    recommendations: ['《雾中风景》', '《悲情城市》', '《能召回前世的布米叔叔》', '《一一》'],
    color: '#e879f9',
    rarity: 'legendary',
  },
  {
    id: 'NCAS',
    name: '潜力股影迷',
    nameEn: 'Potential Cinephile',
    tags: ['特色', '经典', '独到', '入门'],
    tagline: '已经开始与众不同，只差更多积累。',
    description:
      '你不再满足于大众熟知的标准答案，会主动选择更有作者气质、更需要耐心的作品。你的判断有时靠直觉，有时靠审美雷达，体系还在搭建中，但方向明确：你正在离「随便看看」的观众越来越远，离真正的影迷越来越近。多刷片、多记导演，你的类型很快就会定型。',
    spiritDirector: '韦斯·安德森 / 贾樟柯 / 今敏',
    quote: '"《布达佩斯大饭店》的画面好美……不是，我说的是构图……"',
    recommendations: ['《布达佩斯大饭店》', '《世界》', '《千年女优》', '《花样年华》'],
    color: '#d8b4fe',
    rarity: 'uncommon',
  },

  // ===== N-G-* 特色争议派 =====
  {
    id: 'NGOM',
    name: '邪典考古学家',
    nameEn: 'Cult Archaeologist',
    tags: ['特色', '争议', '正统', '迷影'],
    tagline: '怪片也要讲谱系，邪典也有方法论。',
    description:
      '你偏爱冷门、怪异、评价两极的作品，但不是随便猎奇。你会把邪典片、实验失败和作者脉络放在一起研究，试图从不稳定的文本里读出创作野心。你的片单像地下资料馆——外人进去会迷路，但你知道每一部「怪片」在影史里的位置和为什么值得被看见。',
    spiritDirector: '约翰·沃特斯 / 大卫·柯南伯格 / 蔡明亮',
    quote: '"这部片标记才几百人……但它是神作，我有完整论据。"',
    recommendations: ['《粉红火烈鸟》', '《录像带谋杀案》', '《爱情万岁》', '《扒手》'],
    color: '#b45309',
    rarity: 'rare',
  },
  {
    id: 'NGOS',
    name: '好奇探路者',
    nameEn: 'Curious Scout',
    tags: ['特色', '争议', '正统', '轻度'],
    tagline: '开始往冷门走，还在摸索自己的理由。',
    description:
      '你开始被「特色」标签吸引，会点进标记人数不多、评论两极的片单，但坦白说，有时你也说不清它们好在哪里——只是觉得选这个「显得比较有品味」。你看的量还不大，方向却已经在形成：比起安全的高分片，你更愿意试试需要解释的那一类。再多看几部，你的理由会从「很特别」变成「因为……」',
    spiritDirector: '是枝裕和 / 李沧东 / 毕赣',
    quote: '"这片子……很……特别。你应该看看。" ——其实你也在消化。',
    recommendations: ['《燃烧》', '《路边野餐》', '《地球最后的夜晚》', '《刺客聂隐娘》'],
    color: '#92400e',
    rarity: 'common',
  },
  {
    id: 'NGAM',
    name: 'B级片挖掘机',
    nameEn: 'B-Movie Digger',
    tags: ['特色', '争议', '独到', '迷影'],
    tagline: '正常人里的异端，异端里的权威。',
    description:
      '你阅片无数，却偏爱大师翻车、邪典实验、口碑雪崩的作品，并能从中解读出「这才是导演真正的表达」。你对「烂片」的标准和常人不同——《房间》可以是天才，《圣山》可以看了五遍。你的选择经常最出人意料，但很少没有逻辑：你在挖的是电影的暗面与极限。',
    spiritDirector: '拉斯·冯·提尔 / 三池崇史 / 大卫·林奇',
    quote: '"你们觉得这是烂片？你们根本没看懂导演想说什么。"',
    recommendations: ['《房间》', '《切肤之爱》', '《圣山》', '《橡皮头》'],
    color: '#b91c1c',
    rarity: 'legendary',
  },
  {
    id: 'NGAS',
    name: '暗夜探索者',
    nameEn: 'Dark Explorer',
    tags: ['特色', '争议', '独到', '轻度'],
    tagline: '看得不多，但已经专走夜路。',
    description:
      '你知道的导演不算多，但知道的那几个都「不太对劲」。你容易被海报暗、标题怪、朋友警告「别一个人看」的片子吸引。你的品味正在往不可预测的方向生长——没人确定终点在哪，包括你自己。但没关系，你享受这种还在摸索中的刺激感，这比安全地重复高分片更有意思。',
    spiritDirector: '大卫·林奇 / 昆汀 / 北野武',
    quote: '"最近看了一部，做完三天噩梦——挺好看的。"',
    recommendations: ['《穆赫兰道》', '《梦之安魂曲》', '《杀出个黎明》', '《大逃杀》'],
    color: '#881337',
    rarity: 'uncommon',
  },
]

export interface DimensionLabel {
  letter: string
  label: string
  desc: string
}

const UNMEASURED: DimensionLabel = { letter: '–', label: '未测量', desc: '' }

function resolveDimLabel(letter: string, positive: DimensionLabel, negative: DimensionLabel): DimensionLabel {
  if (letter === positive.letter) return positive
  if (letter === negative.letter) return negative
  return UNMEASURED
}

/**
 * 获取四个维度的字母标签。无效编码（如 ----）返回 null。
 */
export function getDimensionLabels(code: string): DimensionLabel[] | null {
  if (!code || code.length !== 4 || code === '----') return null

  return [
    resolveDimLabel(code[0], { letter: 'P', label: '大众型', desc: '主流审美的拥抱者。' }, { letter: 'N', label: '特色型', desc: '冷门佳品的挖掘者。' }),
    resolveDimLabel(code[1], { letter: 'C', label: '经典高分型', desc: '相信评分体系的可靠标尺。' }, { letter: 'G', label: '邪典争议型', desc: '能在争议片里品出独特乐趣。' }),
    resolveDimLabel(code[2], { letter: 'O', label: '正统标准型', desc: '认同主流对作品的共识判断。' }, { letter: 'A', label: '独到反思型', desc: '偏爱导演非典型的一面。' }),
    resolveDimLabel(code[3], { letter: 'M', label: '核心影迷', desc: '阅片量惊人的深度影迷。' }, { letter: 'S', label: '随性轻度', desc: '观影更随缘的娱乐派。' }),
  ]
}
