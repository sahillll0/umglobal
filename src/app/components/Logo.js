'use client';

import React from 'react';
import Image from 'next/image';
import officialLogo from '../../../public/images/logo.jpg';

export default function Logo({ 
  className = '', 
  iconOnly = false, 
  variant = 'default', // 'default' (green/gold), 'gold', 'original' (blue/navy), 'image' (exact logo image asset), 'light'
  showSubtitle = true,
  size = 'md' // 'sm', 'md', 'lg'
}) {
  // Dimensions helper
  const dimensions = {
    sm: { icon: 'w-8 h-8', text: 'text-base', sub: 'text-[8px]', img: 'h-8' },
    md: { icon: 'w-10 h-10', text: 'text-lg sm:text-xl', sub: 'text-[9.5px]', img: 'h-10' },
    lg: { icon: 'w-14 h-14', text: 'text-2xl', sub: 'text-[11px]', img: 'h-14' }
  }[size] || dimensions.md;

  // Gradient ID generator
  const gradientId = React.useId().replace(/:/g, '');

  // Gradient colors matching variant
  const getGradientColors = () => {
    switch (variant) {
      case 'gold':
        return { start: '#F8E8B0', mid: '#C9A227', stop: '#8A6810' };
      case 'original':
      case 'blue':
        // Exact blue to midnight navy gradient from the user image
        return { start: '#3B82F6', mid: '#1D4ED8', stop: '#0B132B' };
      case 'light':
        return { start: '#FFFFFF', mid: '#E2E8F0', stop: '#94A3B8' };
      case 'default':
      default:
        // Metallic Gold with Emerald Depth
        return { start: '#F5D77F', mid: '#C9A227', stop: '#0F5132' };
    }
  };

  const colors = getGradientColors();

  // If variant === 'image', render the official high-res logo image
  if (variant === 'image') {
    return (
      <div className={`flex items-center gap-3 shrink-0 ${className}`}>
        <div className={`relative ${dimensions.img} flex items-center justify-center shrink-0`}>
          <Image
            src={officialLogo}
            alt="UM Global Exim Official Logo"
            className="h-full w-auto object-contain rounded-lg shadow-md bg-white p-0.5"
            style={{ height: '100%', width: 'auto' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 shrink-0 ${className}`}>
      {/* Precision Vector Monogram Emblem (100% matches official brand mark geometry) */}
      <div className={`relative ${dimensions.icon} flex items-center justify-center shrink-0`}>
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full drop-shadow-md transition-transform duration-300 group-hover:scale-105"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`logoGrad_${gradientId}`} x1="50" y1="5" x2="50" y2="95" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={colors.start} />
              <stop offset="45%" stopColor={colors.mid} />
              <stop offset="100%" stopColor={colors.stop} />
            </linearGradient>
          </defs>

          {/* Outer Left Arch (curves top left, connects at bottom left corner) */}
          <path
            d="M 47 10 C 27 10 12 25 12 45 L 12 88 L 32 88 L 32 75 L 24 75 L 24 45 C 24 32 34 22 47 22 Z"
            fill={`url(#logoGrad_${gradientId})`}
          />

          {/* Outer Right Arch (curves top right down to right base) */}
          <path
            d="M 53 10 C 73 10 88 25 88 45 L 88 88 L 76 88 L 76 45 C 76 32 66 22 53 22 Z"
            fill={`url(#logoGrad_${gradientId})`}
          />

          {/* Inner Arch with Central M Peak */}
          <path
            d="M 50 27 C 38 27 30 35 30 47 L 30 88 L 43 88 L 43 56 L 50 66 L 57 56 L 57 88 L 70 88 L 70 47 C 70 35 62 27 50 27 Z M 50 37 C 54 37 57 41 57 45 L 50 55 L 43 45 C 43 41 46 37 50 37 Z"
            fill={`url(#logoGrad_${gradientId})`}
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {!iconOnly && (
        <div className="flex flex-col justify-center shrink-0">
          <div className={`flex items-baseline gap-1.5 ${dimensions.text} font-black tracking-tight whitespace-nowrap leading-none`}>
            <span className={variant === 'original' || variant === 'blue' ? 'text-slate-900' : 'text-white group-hover:text-emerald-100 transition-colors'}>
              UM GLOBAL
            </span>
            <span className="text-[#C9A227] group-hover:text-amber-300 transition-colors">
              EXIM
            </span>
          </div>
          {showSubtitle && (
            <span className={`font-bold tracking-[0.18em] ${dimensions.sub} uppercase whitespace-nowrap mt-1 leading-none ${
              variant === 'original' || variant === 'blue' ? 'text-slate-500' : 'text-emerald-200/90'
            }`}>
              Private Limited • India
            </span>
          )}
        </div>
      )}
    </div>
  );
}
