import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface PageTransitionProps {
  children: ReactNode
  /** 'slide' = horizontal slide (within tab navigation), 'fade' = cross-fade (auth), 'scale' = scale-in */
  variant?: 'slide' | 'fade' | 'scale'
}

const VARIANTS = {
  slide: {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: -24 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit:    { opacity: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit:    { opacity: 0, scale: 1.02 },
  },
} as const

export default function PageTransition({ children, variant = 'slide' }: PageTransitionProps) {
  const v = VARIANTS[variant]
  return (
    <motion.div
      initial={v.initial}
      animate={v.animate}
      exit={v.exit}
      transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
      style={{ position: 'absolute', inset: 0 }}
    >
      {children}
    </motion.div>
  )
}
