import * as React from 'react';
import { cx } from '../utils';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Nome do símbolo (Material Symbols Rounded), ex.: "check". */
  name: string;
  /** s = pequeno, l = grande; omitido = padrão. */
  size?: 's' | 'l';
  /** Texto acessível. Sem ele o ícone é decorativo (aria-hidden). */
  label?: string;
}

export function Icon({ name, size, label, className, ...rest }: IconProps) {
  return (
    <span
      className={cx('ds-icon', size && `ds-icon--${size}`, className)}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      {...rest}
    >
      {name}
    </span>
  );
}
