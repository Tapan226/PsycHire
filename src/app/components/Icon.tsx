import React from 'react';
import svgPaths from '@/imports/svg-ve78d83sqx';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  pathKey: keyof typeof svgPaths;
  size?: number | string;
  fill?: string;
  stroke?: string;
  viewBox?: string;
}

export const Icon: React.FC<IconProps> = ({ 
  pathKey, 
  size = 20, 
  fill = "none", 
  stroke = "currentColor", 
  viewBox = "0 0 20 20",
  className,
  ...props 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={viewBox} 
      fill={fill} 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path 
        d={svgPaths[pathKey]} 
        stroke={stroke} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="1.5" 
      />
    </svg>
  );
};
