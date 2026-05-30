/** 一部作品 */
export interface FilmWork {
  title: string
  year: number
  description: string
  /** 该选项附加的 vibe 标签，用于匹配人格类型 */
  vibes: string[]
}

/** 一位导演 */
export interface Director {
  id: string
  name: string
  nameEn: string
  /** 一句话简介 */
  bio: string
  /** 头像色（用于占位） */
  color: string
  /** 代表作 */
  famousWork: FilmWork
  /** 争议作品 */
  controversialWork: FilmWork
  /** 小众佳作 */
  hiddenGem: FilmWork
  /** 其他知名作品 */
  otherWork: FilmWork
}

/** 用户的一次作答 */
export interface Answer {
  directorId: string
  /** 'famous' | 'controversial' | 'hidden' | 'other' | 'unknown' */
  choice: AnswerChoice
}

export type AnswerChoice = 'famous' | 'controversial' | 'hidden' | 'other' | 'unknown'

/** DBTI 人格类型 */
export interface DBTIType {
  id: string
  name: string
  nameEn: string
  /** 标签云（匹配的 vibe） */
  tags: string[]
  /** 一句话概括 */
  tagline: string
  /** 详细描述 */
  description: string
  /** 代表导演推荐 */
  spiritDirector: string
  /** 经典台词 / 电影 quote */
  quote: string
  /** 适合看的电影推荐 */
  recommendations: string[]
  /** 颜色 */
  color: string
  /** 分级（稀有度） */
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary'
}

/** 测试题 */
export interface QuizQuestion {
  director: Director
  /** 打乱后的选项顺序 */
  order: AnswerChoice[]
}

/** AI 分析结果 */
export interface AIAnalysis {
  typeId: string
  matchScore: number
  matchReason: string
  roast: string
  recommendations: string[]
}

/** 分析结果 */
export interface QuizResult {
  type: DBTIType
  /** 各维度的得分（用于展示雷达图或详情） */
  dimensions: Record<string, number>
  /** 选项分布统计 */
  choiceCounts?: Record<string, number>
  /** 最喜欢的导演（哪题选了代表作/争议作等） */
  favoriteDirector: string
  /** 用户已认识的导演数 */
  knownCount: number
  /** 匹配度评分（0-100） */
  matchScore: number
}
