import type { DirectorCompareQuestion } from '@/types'

/**
 * 6 组导演对比题 — 每组 4 位风格差异鲜明的导演。
 * 每个选项携带维度映射，直接贡献维分。
 */
export const compareQuestions: DirectorCompareQuestion[] = [
  {
    id: 'dc_1',
    question: '以下导演中，谁的作品风格最能击中你？',
    directors: [
      {
        id: 'steven-spielberg',
        name: '斯皮尔伯格',
        nameEn: 'Steven Spielberg',
        style: '商业大片情感共鸣',
        dims: { p: 1, c: 1, o: 1 },
      },
      {
        id: 'andrei-tarkovsky',
        name: '塔可夫斯基',
        nameEn: 'Andrei Tarkovsky',
        style: '诗意哲学慢电影',
        dims: { n: 1, a: 1 },
      },
      {
        id: 'park-chan-wook',
        name: '朴赞郁',
        nameEn: 'Park Chan-wook',
        style: '暴力美学复仇叙事',
        dims: { g: 1, a: 1 },
      },
      {
        id: 'kore-eda-hirokazu',
        name: '是枝裕和',
        nameEn: 'Kore-eda Hirokazu',
        style: '日常温情家庭',
        dims: { n: 1, o: 1 },
      },
    ],
  },
  {
    id: 'dc_2',
    question: '你更喜欢哪位导演讲故事的方式？',
    directors: [
      {
        id: 'christopher-nolan',
        name: '诺兰',
        nameEn: 'Christopher Nolan',
        style: '精密结构烧脑',
        dims: { p: 1, c: 1, o: 1 },
      },
      {
        id: 'wong-kar-wai',
        name: '王家卫',
        nameEn: 'Wong Kar-wai',
        style: '情绪氛围碎片',
        dims: { n: 1, a: 1 },
      },
      {
        id: 'quentin-tarantino',
        name: '昆汀',
        nameEn: 'Quentin Tarantino',
        style: '话痨暴力环形',
        dims: { g: 1, a: 1 },
      },
      {
        id: 'jia-zhangke',
        name: '贾樟柯',
        nameEn: 'Jia Zhangke',
        style: '社会写实记录',
        dims: { n: 1, o: 1 },
      },
    ],
  },
  {
    id: 'dc_3',
    question: '哪位导演的创作理念更让你认同？',
    directors: [
      {
        id: 'stanley-kubrick',
        name: '库布里克',
        nameEn: 'Stanley Kubrick',
        style: '冷峻理性完美主义',
        dims: { c: 1, o: 1 },
      },
      {
        id: 'hayao-miyazaki',
        name: '宫崎骏',
        nameEn: 'Hayao Miyazaki',
        style: '治愈想象环保',
        dims: { p: 1, o: 1 },
      },
      {
        id: 'david-lynch',
        name: '大卫·林奇',
        nameEn: 'David Lynch',
        style: '梦境潜意识',
        dims: { n: 1, a: 1 },
      },
      {
        id: 'bong-joon-ho',
        name: '奉俊昊',
        nameEn: 'Bong Joon-ho',
        style: '类型社会批判',
        dims: { p: 1, a: 1 },
      },
    ],
  },
  {
    id: 'dc_4',
    question: '下面导演营造的氛围，哪种更能打动你？',
    directors: [
      {
        id: 'federico-fellini',
        name: '费里尼',
        nameEn: 'Federico Fellini',
        style: '狂欢热闹生命活力',
        dims: { p: 1, g: 1 },
      },
      {
        id: 'ingmar-bergman',
        name: '伯格曼',
        nameEn: 'Ingmar Bergman',
        style: '严肃存在困境',
        dims: { n: 1, c: 1 },
      },
      {
        id: 'pedro-almodovar',
        name: '阿莫多瓦',
        nameEn: 'Pedro Almodóvar',
        style: '浓烈色彩女性',
        dims: { g: 1, a: 1 },
      },
      {
        id: 'tsai-ming-liang',
        name: '蔡明亮',
        nameEn: 'Tsai Ming-liang',
        style: '孤独缓慢疏离',
        dims: { n: 1, a: 1 },
      },
    ],
  },
  {
    id: 'dc_5',
    question: '从视觉美学上看，你更偏爱谁的世界？',
    directors: [
      {
        id: 'zhang-yimou',
        name: '张艺谋',
        nameEn: 'Zhang Yimou',
        style: '东方色彩磅礴',
        dims: { p: 1, o: 1 },
      },
      {
        id: 'wes-anderson',
        name: '韦斯·安德森',
        nameEn: 'Wes Anderson',
        style: '对称糖果怪诞',
        dims: { n: 1, a: 1 },
      },
      {
        id: 'akira-kurosawa',
        name: '黑泽明',
        nameEn: 'Akira Kurosawa',
        style: '古典光影力量',
        dims: { c: 1, o: 1 },
      },
      {
        id: 'denis-villeneuve',
        name: '维伦纽瓦',
        nameEn: 'Denis Villeneuve',
        style: '宏大极简沉浸',
        dims: { p: 1, a: 1 },
      },
    ],
  },
  {
    id: 'dc_6',
    question: '从电影中你更想获得什么？',
    directors: [
      {
        id: 'steven-spielberg',
        name: '卡梅隆',
        nameEn: 'James Cameron',
        style: '视觉奇观娱乐',
        dims: { p: 1, g: 1 },
      },
      {
        id: 'hou-hsiao-hsien',
        name: '侯孝贤',
        nameEn: 'Hou Hsiao-hsien',
        style: '长镜头生活流',
        dims: { n: 1, o: 1 },
      },
      {
        id: 'david-fincher',
        name: '芬奇',
        nameEn: 'David Fincher',
        style: '精密暗黑人性',
        dims: { c: 1, a: 1 },
      },
      {
        id: 'apichatpong-weerasethakul',
        name: '阿彼察邦',
        nameEn: 'Apichatpong Weerasethakul',
        style: '魔幻丛林轮回',
        dims: { n: 1, a: 1 },
      },
    ],
  },
]
