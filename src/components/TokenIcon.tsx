import React from 'react';
import { motion } from 'framer-motion';

interface TokenIconProps {
  symbol: 'ETH' | 'FLUF';
  size?: number;
  className?: string;
  animated?: boolean;
}

const EthIcon: React.FC<{ size: number; className?: string }> = ({ size, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2L5.5 12.5L12 16L18.5 12.5L12 2Z"
      fill="currentColor"
      fillOpacity="0.6"
    />
    <path
      d="M12 17.5L5.5 13.5L12 22L18.5 13.5L12 17.5Z"
      fill="currentColor"
    />
  </svg>
);

const FlufIcon: React.FC<{ size: number; className?: string }> = ({ size, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.2" />
    <circle cx="8" cy="10" r="3" fill="currentColor" fillOpacity="0.4" />
    <circle cx="16" cy="10" r="3" fill="currentColor" fillOpacity="0.4" />
    <circle cx="12" cy="14" r="4" fill="currentColor" fillOpacity="0.6" />
    <circle cx="6" cy="14" r="2" fill="currentColor" fillOpacity="0.3" />
    <circle cx="18" cy="14" r="2" fill="currentColor" fillOpacity="0.3" />
    <circle cx="12" cy="8" r="2.5" fill="currentColor" fillOpacity="0.5" />
    <circle cx="15" cy="7" r="0.5" fill="currentColor" />
    <circle cx="9" cy="6" r="0.5" fill="currentColor" />
    <circle cx="17" cy="17" r="0.5" fill="currentColor" />
    <circle cx="7" cy="18" r="0.5" fill="currentColor" />
  </svg>
);

export const TokenIcon: React.FC<TokenIconProps> = ({ 
  symbol, 
  size = 24, 
  className = '', 
  animated = false 
}) => {
  const iconProps = { size, className };
  
  const IconComponent = symbol === 'ETH' ? EthIcon : FlufIcon;
  
  if (animated) {
    return (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        <IconComponent {...iconProps} />
      </motion.div>
    );
  }
  
  return <IconComponent {...iconProps} />;
};