import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

export default function V2Button({
  children,
  onClick,
  href,
  variant = 'primary', // 'primary' | 'secondary' | 'play' | 'ghost'
  icon = 'arrow', // 'arrow' | 'play' | 'none'
  className = '',
  size = 'md' // 'sm' | 'md' | 'lg'
}) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-3.5 text-base'
  }[size] || 'px-6 py-3 text-sm';

  const variantClasses = {
    primary: 'bg-[#1E3633] text-[#FAF8F5] hover:bg-[#2B4B47] shadow-sm font-medium',
    secondary: 'bg-white text-[#1A2421] border border-[#D8D1C2] hover:bg-[#F4EFE6] hover:border-[#B8AF9D] font-medium',
    play: 'bg-white text-[#1A2421] border border-[#D8D1C2] hover:bg-[#F4EFE6] pl-4 pr-5 font-medium',
    ghost: 'bg-transparent text-[#1A2421] hover:text-[#1E3633] hover:underline p-0 font-medium'
  }[variant] || 'bg-[#1E3633] text-white';

  const handleClick = (e) => {
    if (href && typeof window !== 'undefined' && window.navigateTo && href.startsWith('/')) {
      e.preventDefault();
      window.navigateTo(href);
    } else if (onClick) {
      onClick(e);
    }
  };

  const content = (
    <>
      {variant === 'play' && (
        <span className="w-6 h-6 rounded-full bg-[#EBF1ED] text-[#1E3633] flex items-center justify-center mr-2">
          <Play className="w-3 h-3 fill-current ml-0.5" />
        </span>
      )}
      <span>{children}</span>
      {icon === 'arrow' && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 ml-1.5" />}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={handleClick}
        className={`group inline-flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer ${sizeClasses} ${variantClasses} ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group inline-flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer ${sizeClasses} ${variantClasses} ${className}`}
    >
      {content}
    </button>
  );
}
