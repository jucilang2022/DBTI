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
        'dbti-page min-h-screen',
        centered && 'flex items-center justify-center',
        overflowHidden && 'overflow-hidden',
        className,
      )}
      {...props}
    >
      {background}
      <div
        className={cn(
          'relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6',
          centered ? 'py-8 sm:py-12' : 'pt-10 pb-12 sm:pt-12 sm:pb-16',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function Section({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-4 sm:space-y-6', className)} {...props} />
}

export function Card({ className, ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      className={cn('dbti-card border p-4 sm:p-6', className)}
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
