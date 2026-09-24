import { motion } from 'motion/react'

export default function FadeContent({ children, visible = true, duration = 0.6, className = '' }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration, ease: 'easeInOut' }}
            className={className}
            aria-hidden={!visible}
        >
            {children}
        </motion.div>
    )
}