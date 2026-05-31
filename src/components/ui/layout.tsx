import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { buttonClasses } from './buttonStyles'

interface PageShellProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  background?: ReactNode
  contentClassName?: string
  centered?: boolean
  overflowHidden?: boolean
}

export function PageShell({
  children,
  background,
  className,
  contentClassName,
  centered = false,
  overflowHidden = false,
  ...props
}: PageShellProps) {
  return (
    <div
      className={cn(
        'min-h-screen bg-[#0a0a0f]',
        centered && 'flex items-center justify-center',
        overflowHidden && 'overflow-hidden',
        className,
      )}
      {...props}
    >
      {background}
      <div
        className={cn(
          'relative z-10 w-full max-w-lg mx-auto px-6',
          centered ? 'py-12' : 'pt-12 pb-16',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function Section({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-6', className)} {...props} />
}

export function Card({ className, ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      className={cn('rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6', className)}
      {...props}
    />
  )
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonClasses
}

export function Button({ className, variant = 'secondary', ...props }: ButtonProps) {
  return <button className={cn(buttonClasses[variant], className)} {...props} />
}
