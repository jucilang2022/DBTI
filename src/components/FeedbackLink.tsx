import { cn } from '@/lib/utils'

interface FeedbackLinkProps {
  className?: string
}

export function FeedbackLink({ className }: FeedbackLinkProps) {
  return (
    <p className={cn('text-right text-xs text-zinc-600', className)}>
      建议/反馈？→{' '}
      <a
        href="https://www.douban.com/people/230674291"
        target="_blank"
        rel="noreferrer"
        className="text-zinc-400 underline-offset-4 hover:text-zinc-200 hover:underline"
      >
        月亮
      </a>
    </p>
  )
}
