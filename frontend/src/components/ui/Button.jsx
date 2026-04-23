import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

const variants = {
  primary: 'bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:shadow-glow-md hover:from-violet-500 hover:to-blue-500',
  secondary: 'glass text-white hover:bg-white/10 hover:border-white/20',
  ghost: 'text-white/70 hover:text-white hover:bg-white/5',
  danger: 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]',
  success: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]',
  outline: 'border border-violet-500/50 text-violet-400 hover:bg-violet-500/10 hover:border-violet-400',
};

const sizes = {
  xs: 'px-3 py-1.5 text-xs rounded-lg',
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-sm rounded-xl',
  lg: 'px-8 py-4 text-base rounded-xl',
  xl: 'px-10 py-5 text-lg rounded-2xl',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon,
  iconRight,
  className,
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={clsx(
        'relative inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      {children}
      {!isLoading && iconRight && <span className="flex-shrink-0">{iconRight}</span>}
    </motion.button>
  );
};

export default Button;
