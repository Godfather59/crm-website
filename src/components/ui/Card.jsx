/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';

export default function Card({ children, className = '', hoverEffect = true }) {
    return (
        <motion.div
            whileHover={hoverEffect ? { y: -5, boxShadow: '0 10px 30px -10px rgba(100, 61, 194, 0.3)' } : {}}
            className={`glass-card p-6 ${className}`}
        >
            {children}
        </motion.div>
    );
}
