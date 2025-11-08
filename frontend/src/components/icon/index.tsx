import type { IconProps } from './types';

export const Icon = ({
  name,
  className = '',
  filled = false,
  size = 24,
  style,
}: IconProps) => {
  const baseClass = filled ? `ti ti-${name}-filled` : `ti ti-${name}`;

  return (
    <i
      className={`${baseClass} ${className}`}
      style={
        {
          fontSize: typeof size === 'number' ? `${size}px` : size,
          ...style,
        } as React.CSSProperties
      }
      aria-hidden="true"
    />
  );
};
