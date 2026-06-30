import type { ButtonHTMLAttributes } from 'react';
import '../css/Button.css';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

export default function Button({ variant = 'primary', fullWidth, className, ...props }: ButtonProps) {
  const cls = ['btn', `btn--${variant}`, fullWidth ? 'btn--full' : '', className ?? '']
    .filter(Boolean)
    .join(' ');
  return <button className={cls} {...props} />;
}