import type { IconProps } from './types';

/**
 * Tabler Icons Icon Component
 *
 * Renders Tabler Icons using the tabler-300.css stylesheet.
 * Documentation: https://tabler.io/icons
 *
 * @example
 * <Icon name="menu" size={24} />
 * <Icon name="x" size={20} />
 * <Icon name="arrow-right" size={16} />
 */
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
