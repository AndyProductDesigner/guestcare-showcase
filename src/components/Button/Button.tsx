import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

type ButtonVariant = 'primary' | 'secondary' | 'text';
type IconPosition = 'start' | 'end';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  icon?: ReactNode;
  iconPosition?: IconPosition;
};

function Button({
  children,
  variant = 'primary',
  icon,
  iconPosition = 'start',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`button button-${variant} ${className}`.trim()}
      {...props}
    >
      {icon && iconPosition === 'start' && (
        <span className="button-icon">{icon}</span>
      )}

      <span className="button-content">{children}</span>

      {icon && iconPosition === 'end' && (
        <span className="button-icon">{icon}</span>
      )}
    </button>
  );
}

export default Button;
