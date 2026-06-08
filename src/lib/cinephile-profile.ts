import { DBTI_TYPES } from '@/data/dbti-types'
import type { DBTIType, QuizResult } from '@/types'

export interface StoredDBTIEntry {
  id?: string
  typeId: string
  typeName: string
  matchScore: number
  knownCount: number
  timestamp: string
  result?: QuizResult
}

export interface CinephileProfileData {
  displayName: string
  bio: string
  favoriteFilms: string[]
}

export const DEFAULT_PROFILE: CinephileProfileData = {
  displayName: '无名放映员',
  bio: '在电影与生活之间，寻找自己的银幕坐标。',
  favoriteFilms: ['花样年华', '一一', '重庆森林'],
}

export function getLatestDBTIEntry(): StoredDBTIEntry | null {
  try {
    const history = JSON.parse(localStorage.getItem('dbti_history') || '[]') as StoredDBTIEntry[]
    return history[0] ?? null
  } catch {
    return null
  }
}

export function getLatestDBTIType(entry: StoredDBTIEntry | null): DBTIType | null {
  if (!entry) return null
  return DBTI_TYPES.find((type) => type.id === entry.typeId) ?? entry.result?.type ?? null
}

export function getCinephileProfile(): CinephileProfileData {
  try {
    const saved = JSON.parse(localStorage.getItem('cinephile_profile') || 'null')
    return saved ? { ...DEFAULT_PROFILE, ...saved } : DEFAULT_PROFILE
  } catch {
    return DEFAULT_PROFILE
  }
}

export function saveCinephileProfile(profile: CinephileProfileData) {
  localStorage.setItem('cinephile_profile', JSON.stringify(profile))
}
