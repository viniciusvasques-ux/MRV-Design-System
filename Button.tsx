import * as React from 'react';
import { cx } from '../utils';
import { Icon } from './Icon';

export type ButtonVariant = 'default' | 'positive' | 'negative' | 'alert';
/** filled = preenchido, light = claro, outline = com linha (positivo e negativo). */
export type ButtonAppearance = 'filled' | 'light' | 'outline';

function classes(variant: ButtonVariant, appearance: ButtonAppearance, pill: boolean | undefined, icon: boolean) {
  return cx(
    'ds-btn',
    icon && 'ds-btn--icon',
    variant !== 'default' && `ds-btn--${variant}`,
    appearance === 'light' && 'ds-btn--light',
    appearance === 'outline' && 'ds-btn--outline',
    pill && 'ds-btn--pill',
  );
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  appearance?: ButtonAppearance;
  /** Borda redonda (alternativo). */
  pill?: boolean;
  /** Ícone à direita do rótulo (nome do Material Symbol). */
  icon?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'default', appearance = 'filled', pill, icon, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={cx(classes(variant, appearance, pill, false), className)} {...rest}>
      <span className="fontsize-x-semi">{children}</span>
      {icon && <Icon name={icon} />}
    </button>
  );
});

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** Nome do Material Symbol. */
  icon: string;
  /** Obrigatório: botão só com ícone precisa de nome acessível. */
  'aria-label': string;
  variant?: ButtonVariant;
  appearance?: ButtonAppearance;
  pill?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, variant = 'default', appearance = 'filled', pill, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={cx(classes(variant, appearance, pill, true), className)} {...rest}>
      <Icon name={icon} />
    </button>
  );
});
