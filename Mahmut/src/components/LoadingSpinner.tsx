import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'currentColor',
  className = '',
}) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large',
  };

  return (
    <div
      className={`loading-spinner ${sizeClasses[size]} ${className}`}
      style={{ color }}
      role="status"
      aria-label="Loading"
    >
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
