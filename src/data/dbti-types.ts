import type { DBTIType } from '@/types'

/**
 * DBTI 12 型人格体系
 *
 * 每位用户完成 10 道题后，根据所选作品的「vibe 标签」匹配到最契合的类型。
 */
export const DBTI_TYPES: DBTIType[] = [
  {
    id: 'POET',
    name: '银幕诗人',
    nameEn: 'Screen Poet',
    tags: ['诗意', '唯美', '文艺', '浪漫'],
    tagline: '影像即诗，镜头即韵',
    description:
      '你偏爱那些像诗一样的电影，叙事节奏舒缓，画面每一帧都可以截图做壁纸。你不追求强烈的戏剧冲突，而是沉醉于导演营造的氛围和情绪。在电影院里，你是那个会盯着片尾字幕不愿起身的人。',
    spiritDirector: '王家卫 / 侯孝贤 / 泰伦斯·马力克',
    quote: '"所有的记忆都是潮湿的。" ——《2046》',
    recommendations: ['《花样年华》', '《悲情城市》', '《生命之树》', '《路边野餐》'],
    color: '#e879f9',
    rarity: 'uncommon',
  },
  {
    id: 'STORY',
    name: '叙事工匠',
    nameEn: 'Story Craftsman',
    tags: ['叙事', '结构', '情节', '悬疑'],
    tagline: '好故事才是电影的灵魂',
    description:
      '你是纯粹的故事爱好者，最在乎的是「这个电影讲了个什么样的故事」。你会为精巧的叙事结构拍案叫绝，也会为编剧的巧妙伏笔会心一笑。对你来说，一部电影如果有好故事，其他都可以原谅。',
    spiritDirector: '克里斯托弗·诺兰 / 奉俊昊 / 杨德昌',
    quote: '"一部好的悬疑片，观众在最后一刻才恍然大悟。" ——诺兰',
    recommendations: ['《盗梦空间》', '《寄生虫》', '《一一》', '《记忆碎片》'],
    color: '#38bdf8',
    rarity: 'common',
  },
  {
    id: 'VISUAL',
    name: '视觉猎手',
    nameEn: 'Visual Hunter',
    tags: ['视觉', '镜头', '构图', '史诗'],
    tagline: '眼睛是灵魂的第一个导演',
    description:
      '画面即一切。你是那种会因为一个镜头爱上一整部电影的观众。色彩、光线、运镜、构图——你痴迷于影像语言的极致魅力。对别人来说好看的电影，对你来说是「好看的」电影。',
    spiritDirector: '张艺谋 / 韦斯·安德森 / 丹尼斯·维伦纽瓦',
    quote: '"电影是每秒24格的真理。" ——《天堂电影院》',
    recommendations: ['《英雄》', '《布达佩斯大饭店》', '《沙丘》', '《大红灯笼高高挂》'],
    color: '#f59e0b',
    rarity: 'uncommon',
  },
  {
    id: 'REAL',
    name: '现实之眼',
    nameEn: 'Eye of Reality',
    tags: ['现实', '社会', '记录', '心理'],
    tagline: '真实永远比虚构更震撼',
    description:
      '你不喜欢花哨的镜头和刻意的煽情，你追求的是「真实」。那些关注小人物命运、揭露社会现实的电影最能打动你。你不是去看电影，而是透过电影去看真实的世界。',
    spiritDirector: '贾樟柯 / 是枝裕和 / 阿涅斯·瓦尔达',
    quote: '"电影能做的不仅是讲故事，而是让我们看见。" ——贾樟柯',
    recommendations: ['《小武》', '《小偷家族》', '《天水围的日与夜》', '《三峡好人》'],
    color: '#a8a29e',
    rarity: 'common',
  },
  {
    id: 'BLOCK',
    name: '商业巨匠',
    nameEn: 'Blockbuster Maestro',
    tags: ['商业', '大众', '类型', '娱乐'],
    tagline: '好看就是王道，票房也是艺术',
    description:
      '你毫不掩饰对商业大片的喜爱。场面够大、节奏够快、娱乐性够强，那就是好电影。你不理解什么叫「曲高和寡」，也不觉得商业和艺术是对立的——斯皮尔伯格和诺兰不也都是商业导演吗？好看，就够了。',
    spiritDirector: '史蒂文·斯皮尔伯格 / 克里斯托弗·诺兰 / 徐克',
    quote: '"电影首先是娱乐，然后才是艺术。" ——史蒂文·斯皮尔伯格',
    recommendations: ['《侏罗纪公园》', '《星际穿越》', '《英雄》', '《让子弹飞》'],
    color: '#f97316',
    rarity: 'common',
  },
  {
    id: 'HIDDEN',
    name: '冷门猎手',
    nameEn: 'Rarity Hunter',
    tags: ['小众', '冷门', '遗珠', '文艺'],
    tagline: '真正的宝藏都在聚光灯之外',
    description:
      '你是朋友圈里的「那个很懂电影的人」。主流榜单上的电影你看不上，你热衷于挖掘那些被低估、被忽视、尚未被大众发现的杰作。每当找到一部冷门好片，那种成就感不亚于挖到宝藏。',
    spiritDirector: '毕赣 / 今敏 / 蔡明亮',
    quote: '"伟大的电影往往在最初无人问津。" ——安德烈·塔可夫斯基',
    recommendations: ['《路边野餐》', '《未麻之部屋》', '《生之欲》', '《秋刀鱼之味》'],
    color: '#10b981',
    rarity: 'rare',
  },
  {
    id: 'CLASSIC',
    name: '古典传承',
    nameEn: 'Classic Heir',
    tags: ['古典', '传统', '大师', '戏剧'],
    tagline: '时间的筛子留下的都是精华',
    description:
      '你尊重经典，尊敬大师。新电影固然好，但真正让你心潮澎湃的还是那些经得起时间考验的杰作。黑泽明、小津安二郎、费里尼——这些名字对你来说不是遥远的符号，而是你精神世界的老朋友。',
    spiritDirector: '黑泽明 / 费德里科·费里尼 / 小津安二郎',
    quote: '"真正的经典不是被记住的，而是被再发现的。"',
    recommendations: ['《七武士》', '《东京物语》', '《八部半》', '《罗生门》'],
    color: '#b45309',
    rarity: 'rare',
  },
  {
    id: 'REBEL',
    name: '反叛先锋',
    nameEn: 'Rebel Vanguard',
    tags: ['反叛', '突破', '颠覆', '暴力'],
    tagline: '打破规则就是唯一的规则',
    description:
      '你天生就喜欢那些「不对劲」的电影。那些打破常规、挑战审美、引发争议的作品，反而最吸引你。你不在乎别人怎么看——如果一部电影让一半人恨它，那它可能正是你的菜。',
    spiritDirector: '昆汀·塔伦蒂诺 / 拉斯·冯·提尔 / 戈达尔',
    quote: '"伟大的艺术总是冒犯性的。" ——昆汀·塔伦蒂诺',
    recommendations: ['《低俗小说》', '《黑暗中的舞者》', '《精疲力尽》', '《老男孩》'],
    color: '#dc2626',
    rarity: 'uncommon',
  },
  {
    id: 'ABSURD',
    name: '荒诞行者',
    nameEn: 'Absurd Walker',
    tags: ['荒诞', '黑色', '讽刺', '幽默'],
    tagline: '世界本就是一场黑色幽默',
    description:
      '你着迷于电影中的荒诞感。那些让你笑着笑着就笑不出来的电影，那些用最欢乐的方式讲最悲哀故事的电影。你相信世界本就是荒诞的，而好导演就是那个把荒诞拍成艺术的人。',
    spiritDirector: '姜文 / 库布里克 / 北野武',
    quote: '"让子弹再飞一会儿。" ——《让子弹飞》',
    recommendations: ['《让子弹飞》', '《奇爱博士》', '《菊次郎的夏天》', '《大话西游》'],
    color: '#7c3aed',
    rarity: 'uncommon',
  },
  {
    id: 'EMOTION',
    name: '情感捕手',
    nameEn: 'Emotion Catcher',
    tags: ['情感', '温情', '共鸣', '浪漫'],
    tagline: '哭过笑过，电影才没有白看',
    description:
      '你是最坦诚的观众——好哭就是好电影。你追求的是情感的共鸣，是散场后那种心被填满的感觉。你不排斥任何能触动人心的电影，无论是爱情片、亲情片还是文艺片。你的眼泪就是最好的影评。',
    spiritDirector: '李安 / 宫崎骏 / 许鞍华',
    quote: '"一部好电影就像一场雨，淋湿了你，也温暖了你。"',
    recommendations: ['《断背山》', '《千与千寻》', '《桃姐》', '《饮食男女》'],
    color: '#fb7185',
    rarity: 'common',
  },
  {
    id: 'GENRE',
    name: '类型通吃',
    nameEn: 'Genre Master',
    tags: ['动作', '娱乐', '类型', '悬疑'],
    tagline: '没有烂类型，只有烂电影',
    description:
      '你是类型片的鉴赏家。无论是武侠、警匪、科幻还是悬疑，你都能找到乐趣。你深知类型片的匠人之心——在框架内做出新意，比自命清高的文艺片难多了。杜琪峰的枪战、诺兰的烧脑、吴宇森的鸽子，你全都要。',
    spiritDirector: '杜琪峰 / 大卫·芬奇 / 周星驰',
    quote: '"类型片从不低人一等，低的是拍不好类型片的人。"',
    recommendations: ['《枪火》', '《搏击俱乐部》', '《喜剧之王》', '《疯狂的石头》'],
    color: '#06b6d4',
    rarity: 'common',
  },
  {
    id: 'PURE',
    name: '纯粹迷影',
    nameEn: 'Pure Cinephile',
    tags: ['大师', '多元', '突破', '视觉', '叙事'],
    tagline: '电影是你爱这个世界的方式',
    description:
      '你对好电影的包容度极高——无论是艺术片还是商业片，无论是东方还是西方，只要是好电影，你就爱。你不设限、不标榜小众也不排斥大众。你只是单纯地热爱电影这种表达形式。在别人眼里，你就是一个纯粹的「影迷」。',
    spiritDirector: '库布里克 / 塔可夫斯基 / 黑泽明',
    quote: '"电影是造梦机器，而你是最投入的做梦者。"',
    recommendations: ['《2001太空漫游》', '《潜行者》', '《七武士》', '《花样年华》'],
    color: '#fef08a',
    rarity: 'legendary',
  },
]

/** 根据 vibe 标签频率找到最匹配的 DBTI 类型 */
export function matchDBTIType(vibeCounts: Record<string, number>): DBTIType {
  // 如果没有足够数据，返回纯粹迷影
  const totalVibes = Object.values(vibeCounts).reduce((a, b) => a + b, 0)
  if (totalVibes === 0) return DBTI_TYPES.find((t) => t.id === 'PURE')!

  let bestType = DBTI_TYPES[0]
  let bestScore = -1

  for (const type of DBTI_TYPES) {
    let score = 0
    for (const tag of type.tags) {
      score += vibeCounts[tag] ?? 0
    }
    // 鼓励选择「没看过」以外的选项
    if (score > bestScore) {
      bestScore = score
      bestType = type
    }
  }

  return bestType
}
