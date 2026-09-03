import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './IconButton.css';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  label: string;
};

function IconButton({
  icon,
  label,
  className = '',
  ...props
}: IconButtonProps) {
  return (
    <button
      className={`icon-button ${className}`.trim()}
      aria-label={label}
      {...props}
    >
      {icon}
    </button>
  );
}

export default IconButton;
