/** 生产环境在 Cloudflare Pages 构建时设置 VITE_API_BASE_URL，开发留空走 Vite 代理 */
export function apiUrl(path: string): string {
  const base = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? ''
  const normalized = path.startsWith('/') ? path : `/${path}`
  return base ? `${base}${normalized}` : normalized
}
