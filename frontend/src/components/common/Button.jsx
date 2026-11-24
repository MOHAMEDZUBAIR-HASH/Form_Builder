import React, { useRef } from 'react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  icon: Icon,
  throttle = true, // Suppress rapid double-clicks
  throttleMs = 800,
  ...props
}) => {
  const lastClickedRef = useRef(0);

  const handleClick = (e) => {
    if (!onClick) return;

    if (throttle) {
      const now = Date.now();
      if (now - lastClickedRef.current < throttleMs) {
        e.preventDefault();
        return;
      }
      lastClickedRef.current = now;
    }

    onClick(e);
  };

  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs select-none cursor-pointer active:scale-98';

  const variants = {
    primary:
      'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white focus:ring-indigo-500 shadow-indigo-100',
    secondary:
      'bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 border border-gray-300 focus:ring-indigo-500',
    danger:
      'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white focus:ring-rose-500 shadow-rose-100',
    success:
      'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white focus:ring-emerald-500 shadow-emerald-100',
    outline:
      'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
    ghost:
      'text-gray-600 hover:text-gray-900 hover:bg-gray-100 shadow-none focus:ring-gray-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
};

export default Button;
