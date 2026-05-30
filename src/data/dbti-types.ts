import type { DBTIType } from '@/types'

/**
 * DBTI 12 型人格 + 4 种触发式特殊人格
 */

export const DBTI_TYPES: DBTIType[] = [
  // ===== 12 核心型 =====
  {
    id: 'POET',
    name: '银幕诗人',
    nameEn: 'Screen Poet',
    tags: ['诗意', '唯美', '文艺', '浪漫'],
    tagline: '你以为自己很王家卫，其实只是睡太晚',
    description:
      '你的豆瓣简介上写着"电影是造梦的艺术"，实际上你就是看电影时最容易睡着的那个人。慢镜头你觉得是意境，别人觉得是拖戏。你最喜欢的电影类型是"感觉"，如果有人问你这片子讲了什么，你想了半天说"就是一种氛围"。',
    spiritDirector: '王家卫 / 泰伦斯·马力克 / 毕赣',
    quote: '"我觉得这个电影...嗯...怎么说呢...就是那种...你懂吗？" ——你的影评',
    recommendations: ['《花样年华》', '《路边野餐》', '《生命之树》', '《德州巴黎》'],
    color: '#e879f9',
    rarity: 'uncommon',
  },
  {
    id: 'STORY',
    name: '叙事警察',
    nameEn: 'Story Police',
    tags: ['叙事', '结构', '情节', '悬疑'],
    tagline: '每个剧情漏洞都逃不过你的眼睛',
    description:
      '你和朋友看电影从来没法好好看——你全程在分析逻辑漏洞。散场后还要拉着人讨论"第三幕的反转其实在第17分钟就暗示了"。朋友表面上点头，心里在想：下次别叫他了。你是那种看了《信条》没觉得难懂、只觉得"这里的时间线物理不对"的人。',
    spiritDirector: '诺兰 / 杨德昌 / 奉俊昊',
    quote: '"等等，这个角色在第23分钟的时候不是还在上海吗？" ——你看每部电影时',
    recommendations: ['《盗梦空间》', '《一一》', '《寄生虫》', '《记忆碎片》'],
    color: '#38bdf8',
    rarity: 'common',
  },
  {
    id: 'VISUAL',
    name: '截图狂魔',
    nameEn: 'Screenshot Maniac',
    tags: ['视觉', '镜头', '构图', '唯美'],
    tagline: '每一帧都想截屏当壁纸',
    description:
      '你去电影院不是为了看电影，是为了截屏发小红书。手机相册里全是电影截图，真正看完的电影没几部。你的屏保每周换三次，每张都是"电影感"十足。你选片的唯一标准：预告片画面好不好看。剧情？那是其次的。',
    spiritDirector: '张艺谋 / 韦斯·安德森 / 维伦纽瓦',
    quote: '"这部电影的画面绝了！！！（剧情是什么不记得了）" ——你的朋友圈',
    recommendations: ['《英雄》', '《布达佩斯大饭店》', '《沙丘》', '《红高粱》'],
    color: '#f59e0b',
    rarity: 'common',
  },
  {
    id: 'REAL',
    name: '人间清醒',
    nameEn: 'Reality Check',
    tags: ['现实', '社会', '记录', '心理'],
    tagline: '看个电影都能分析出社会阶级矛盾',
    description:
      '别人看电影是图一乐，你是在做社会调研。任何电影你都能看出"时代背景、阶级矛盾、性别议题"。你最想做的事就是和贾樟柯喝一杯，然后告诉他《小武》哪里拍得不够真实。你可能是全中国唯一一个看《变形金刚》会思考"这是否影射了资本主义异化"的人。',
    spiritDirector: '贾樟柯 / 是枝裕和 / 迈克·李',
    quote: '"表面上是爱情片，实际上反映了后现代社会中个体的异化与孤独。" ——你的影评开头',
    recommendations: ['《小武》', '《小偷家族》', '《秘密与谎言》', '《一次别离》'],
    color: '#a8a29e',
    rarity: 'uncommon',
  },
  {
    id: 'BLOCK',
    name: '爆米花大师',
    nameEn: 'Popcorn Master',
    tags: ['商业', '大众', '娱乐', '动作'],
    tagline: '开心就好，艺术什么的边儿待着',
    description:
      '你的电影品味：画面够大，声音够响，最后好人赢了，满分。散场后有人问你电影讲了什么，你说"记不清了，但那个爆炸场面真爽"。你是电影院的VIP——爆米花买大份的那种。对你来说，电影评分只有两档：看爽了和没看爽。',
    spiritDirector: '斯皮尔伯格 / 卡梅隆 / 周星驰',
    quote: '"我觉得豆瓣评分7.5以上的都还行。" ——你就是豆瓣用户画像里的"大众"',
    recommendations: ['《侏罗纪公园》', '《喜剧之王》', '《星际穿越》', '《让子弹飞》'],
    color: '#f97316',
    rarity: 'common',
  },
  {
    id: 'HIDDEN',
    name: '豆瓣遗珠猎人',
    nameEn: 'Douban Hidden Gem Hunter',
    tags: ['小众', '冷门', '遗珠', '文艺'],
    tagline: '你看的电影连评分都没有，还骄傲上了',
    description:
      '你对"小众"有执念。一部电影一旦上了豆瓣TOP250，你就自动把它从片单里删了。你最大的成就是发现了一部全豆瓣只有37个人标记过的电影——然后你给打了四星，附上一句"还行，但不如导演早期的作品有灵气"。你那句"这片子很小众"的含金量，比你银行的存款余额还高。',
    spiritDirector: '毕赣 / 蔡明亮 / 阿彼察邦',
    quote: '"这片子知道的人越少越好。" ——你说这话时，表情像在守护一个国家机密',
    recommendations: ['《路边野餐》', '《爱情万岁》', '《能召回前世的布米叔叔》', '《你那边几点》'],
    color: '#10b981',
    rarity: 'rare',
  },
  {
    id: 'CLASSIC',
    name: '老年俱乐部',
    nameEn: 'Old School Club',
    tags: ['古典', '传统', '大师', '戏剧'],
    tagline: '1940年以后的电影都入不了你的眼',
    description:
      '你的片单里最新的电影是《肖申克的救赎》——因为你认为1994年就是电影史的终点了。你每次去电影院都要感叹"现在的电影都是些什么玩意儿"。别人说《奥本海默》好看，你说"你先去看看《七武士》再来跟我说话"。你的影龄比大多数人的年龄还大——你也是这么跟人炫耀的。',
    spiritDirector: '黑泽明 / 小津安二郎 / 费里尼',
    quote: '"他们现在不拍真正的电影了。" ——你说这话时，连最新上映的是什么都不知道',
    recommendations: ['《七武士》', '《东京物语》', '《八部半》', '《小城之春》'],
    color: '#b45309',
    rarity: 'rare',
  },
  {
    id: 'REBEL',
    name: '反骨仔',
    nameEn: 'Rebel',
    tags: ['反叛', '突破', '颠覆', '暴力'],
    tagline: '别人说好的，你偏不看',
    description:
      '如果有人跟你说某部电影特别好看，你的第一反应是：那肯定不怎么样。你以"和大众品味不一样"为荣。昆汀是你的精神导师——不是因为你懂他的电影，而是因为他看起来也不想和正常人做朋友。你的观影记录里充满了"cult"标签，但你也不太确定 cult 到底是什么意思。',
    spiritDirector: '昆汀 / 拉斯·冯·提尔 / 戈达尔',
    quote: '"我觉得这片子被严重高估了。" ——你还没看就已经得出了结论',
    recommendations: ['《低俗小说》', '《黑暗中的舞者》', '《精疲力尽》', '《老男孩》'],
    color: '#dc2626',
    rarity: 'uncommon',
  },
  {
    id: 'ABSURD',
    name: '精神状态存疑',
    nameEn: 'Questionable Mental State',
    tags: ['荒诞', '黑色', '心理', '讽刺'],
    tagline: '喜欢看让人不舒服的电影，你还好吗',
    description:
      '你的周末放松方式：看一部让人精神崩溃的电影。正常人看《穆赫兰道》要查解析，你看了四遍还觉得不过瘾。你的朋友都很担心你——特别是当你笑着说"我今天想重温《梦之安魂曲》放松一下"的时候。你最喜欢的电影风格是"看完想给导演打电话问你是不是恨人类"。',
    spiritDirector: '大卫·林奇 / 库布里克 / 波兰斯基',
    quote: '"我觉得这部电影让我感受到了存在主义的虚无...挺治愈的。" ——你是认真的吗？',
    recommendations: ['《穆赫兰道》', '《2001太空漫游》', '《罗斯玛丽的婴儿》', '《潜行者》'],
    color: '#7c3aed',
    rarity: 'rare',
  },
  {
    id: 'EMOTION',
    name: '泪腺发达',
    nameEn: 'Tear Factory',
    tags: ['情感', '温情', '共鸣', '浪漫'],
    tagline: '看个广告都能哭',
    description:
      '你是电影院里那个哭得最大声的人。别人在吃爆米花，你在抹眼泪。一部电影结束后，你花在补妆上的时间比看电影的时间还长。你的泪点低到令人发指——连《变形金刚》里擎天柱牺牲的时候你都哭了。你不敢在公共场合看任何电影，因为你知道自己撑不过15分钟。',
    spiritDirector: '李安 / 宫崎骏 / 许鞍华',
    quote: '"我没事...就是...眼睛进沙子了..." ——电影明明还没开始放',
    recommendations: ['《断背山》', '《千与千寻》', '《桃姐》', '《天水围的日与夜》'],
    color: '#fb7185',
    rarity: 'common',
  },
  {
    id: 'GENRE',
    name: '片单收藏家',
    nameEn: 'Watchlist Hoarder',
    tags: ['类型', '动作', '娱乐', '悬疑'],
    tagline: '收藏了800部电影，一部都没看',
    description:
      '你是朋友群里的电影点播机——"有没有好看的悬疑片？"你随手就列出50部。你熟知每种类型片的套路，主角活不过几分钟你都能猜到。但问题是你推荐的电影你一部都没看过。你的豆瓣"想看"列表已经突破了四位数，而"看过"列表还停留在去年。你收藏电影的速度比看电影的速度快十倍。',
    spiritDirector: '杜琪峰 / 大卫·芬奇 / 宁浩',
    quote: '"这部电影在我的片单里躺了三年了...等我有空就看。" ——你永远没空',
    recommendations: ['《枪火》', '《搏击俱乐部》', '《疯狂的石头》', '《七宗罪》'],
    color: '#06b6d4',
    rarity: 'common',
  },
  {
    id: 'PURE',
    name: '电影之神',
    nameEn: 'Film God',
    tags: ['大师', '多元', '突破', '视觉', '叙事'],
    tagline: '你懂的太多了，让人有点讨厌',
    description:
      '电影群里最让人又爱又恨的那个人就是你。什么片你都看过，什么导演你都了解，任何话题你都能接上。但有时候你太懂了——别人刚说"我觉得诺兰很厉害"，你回一句"建议你看看他早期的《追随》，比《盗梦空间》有意思多了"。全场沉默。你无法忍受有人把《肖申克的救赎》说成"史上最伟大电影"——因为你知道真正的答案更复杂。不过说真的，你确实懂。',
    spiritDirector: '库布里克 / 塔可夫斯基 / 黑泽明',
    quote: '"这部电影不错，但和他早期的作品比还是差了一点。" ——你每次都这么说',
    recommendations: ['《2001太空漫游》', '《潜行者》', '《七武士》', '《霸王别姬》'],
    color: '#fef08a',
    rarity: 'legendary',
  },
]

// ===== 4 种触发式特殊人格 =====

export const TRIGGER_TYPES: DBTIType[] = [
  {
    id: 'NEWBIE',
    name: '影坛白纸',
    nameEn: 'Cinema Rookie',
    tags: [],
    tagline: '勇敢承认自己没看过，也是一种态度',
    description:
      '你在这10道题里，超过一半选了"没看过"。说实话，你能坚持做完这个测试已经很了不起了。你的电影知识储备相当于一张白纸——但也正因为是白纸，你可以画出任何东西！建议你收藏这个测试页面，等你刷完100部电影再回来重新测一次。我保证你的结果会不一样。（至少不会再次拿到这个人格。）',
    spiritDirector: '（建议从张艺谋开始补起）',
    quote: '"这个导演...是拍什么的来着？" ——你看到每个导演时的反应',
    recommendations: ['《霸王别姬》', '《千与千寻》', '《肖申克的救赎》', '这个测试页面'],
    color: '#6b7280',
    rarity: 'common',
  },
  {
    id: 'DRAMA',
    name: '吃瓜群众',
    nameEn: 'Drama Seeker',
    tags: ['颠覆', '反叛', '黑色', '讽刺'],
    tagline: '你不是来看电影的，是来看热闹的',
    description:
      '你选的片子每一部都在当时闹得沸沸扬扬——要么口碑撕裂，要么导演被骂。你不是一个影迷，你是一个瓜田里的猹。你的观影动机根本不是欣赏艺术，就是想看看"到底有多烂"或者"到底为什么会被骂"。承认吧，你看到一部电影评分两极分化的时候，第一反应不是"这片子讲什么"，而是"让我看看评论区怎么吵的"。',
    spiritDirector: '拉斯·冯·提尔 / 三池崇史 / 昆汀',
    quote: '"听说这片子上映的时候观众都吐了？我去看看。" ——你的日常',
    recommendations: ['《女性瘾者》', '《切肤之爱》', '《地球最后的夜晚》', '《无极》'],
    color: '#ef4444',
    rarity: 'uncommon',
  },
  {
    id: 'HIDDEN_SNIFFER',
    name: '小众装逼犯',
    nameEn: 'Pretentious Picker',
    tags: ['小众', '冷门', '遗珠'],
    tagline: '每部都是小众佳作——你确定你全看懂了？',
    description:
      '你的选择记录简直就是一份"如何假装资深影迷"指南。每一部都是"小众佳作"——问题是，你选的这片子根本连中文字幕都没有啊！你是看的无字幕原版吗？好的，尊贵的冷门观众。不过说真的，有时候选选"代表作"也没什么丢人的，毕竟那确实好看啊。',
    spiritDirector: '蔡明亮 / 阿彼察邦 / 毕赣',
    quote: '"这片子很小众的，你应该没看过。" ——每次推荐电影的开场白',
    recommendations: ['《郊游》', '《正午显影》', '《破碎太阳之心》', '《天边一朵云》'],
    color: '#a21caf',
    rarity: 'rare',
  },
  {
    id: 'MAINSTREAM',
    name: '大众点评',
    nameEn: 'Basic Picker',
    tags: ['商业', '大众', '类型', '叙事'],
    tagline: '你的片单就是豆瓣TOP250的精选集',
    description:
      '你选了每一部"最出名"的作品。不是说不好——只是你有点太...安全了。你的电影品味非常标准，标准到可以直接印在电影教科书上。下次试着选一次"小众佳作"或者"争议之作"，我保证你不会受伤。就算你不喜欢，你也可以拿去装逼啊。老是选"代表作"，怎么在朋友圈立影评人人设呢？',
    spiritDirector: '（你已经不需要推荐了，你看的都是最火的）',
    quote: '"评分挺高的，那就看这个吧。" ——你的选片哲学',
    recommendations: ['试试看一部你从来没听说过的电影', '走出舒适区', '就这一次'],
    color: '#22c55e',
    rarity: 'common',
  },
]

/** 根据 vibe 标签频率找到最匹配的 DBTI 类型 */
export function matchDBTIType(vibeCounts: Record<string, number>): DBTIType {
  const totalVibes = Object.values(vibeCounts).reduce((a, b) => a + b, 0)
  if (totalVibes === 0) {
    // fallback: 没有 vibe 数据
    return DBTI_TYPES.find((t) => t.id === 'STORY')!
  }

  let bestType = DBTI_TYPES[0]
  let bestScore = -1

  for (const type of DBTI_TYPES) {
    let score = 0
    for (const tag of type.tags) {
      score += vibeCounts[tag] ?? 0
    }
    if (score > bestScore) {
      bestScore = score
      bestType = type
    }
  }

  return bestType
}
