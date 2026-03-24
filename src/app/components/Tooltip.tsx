import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: 'top' | 'bottom';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div className={`
          absolute z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-brand-primary rounded-md shadow-lg whitespace-nowrap animate-fade-in
          ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
        `}>
          {content}
          <div className={`
            absolute left-1/2 -translate-x-1/2 border-4 border-transparent
            ${position === 'top' ? 'border-t-brand-primary top-full' : 'border-b-brand-primary bottom-full'}
          `} />
        </div>
      )}
    </div>
  );
}
