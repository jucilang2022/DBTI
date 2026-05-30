import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  const resolved = clsx(inputs)
  return resolved
}

/** 打乱数组（Fisher-Yates） */
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** 随机取 n 个元素 */
export function pickRandom<T>(array: T[], n: number): T[] {
  return shuffle(array).slice(0, n)
}
