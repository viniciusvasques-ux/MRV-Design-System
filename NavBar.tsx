import * as React from 'react';
import { cx } from '../utils';
import { Icon } from './Icon';

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** Fixo no contêiner pai (prévias e quadros) em vez de na tela. */
  contained?: boolean;
}
/** Cabeçalho fixo no topo: aceita NavBar e Tabs encaixadas. */
export const Header = React.forwardRef<HTMLElement, HeaderProps>(function Header({ contained, className, ...rest }, ref) {
  return <header ref={ref} className={cx('ds-header', contained && 'ds-header--contained', className)} {...rest} />;
});

export interface NavBarProps {
  start?: React.ReactNode;
  center?: React.ReactNode;
  end?: React.ReactNode;
  'aria-label'?: string;
}
export function NavBar({ start, center, end, ...rest }: NavBarProps) {
  return (
    <nav className="ds-navbar" aria-label={rest['aria-label'] ?? 'Principal'}>
      {start && <div className="ds-navbar__start">{start}</div>}
      {center && <div className="ds-navbar__center">{center}</div>}
      {end && <div className="ds-navbar__end">{end}</div>}
    </nav>
  );
}

export function NavBarTitle({ icon = 'home', children }: { icon?: string; children: React.ReactNode }) {
  return <p className="ds-navbar__title fontsize-x-regular"><Icon name={icon} />{children}</p>;
}

export interface NavBarBackProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { href?: string }
export function NavBarBack({ children = 'Voltar', className, ...rest }: NavBarBackProps) {
  return (
    <button type="button" className={cx('ds-navbar__back fontsize-x-regular', className)} {...rest}>
      <Icon name="chevron_left" />{children}
    </button>
  );
}

export interface NavBarActionProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  icon: string;
  'aria-label': string;
  /** Aparece só em telas estreitas (agrupa busca e filtros). */
  compact?: boolean;
}
export function NavBarAction({ icon, compact, className, ...rest }: NavBarActionProps) {
  return (
    <button type="button" className={cx('ds-navbar__action', compact && 'ds-navbar__compact', className)} {...rest}>
      <Icon name={icon} />
    </button>
  );
}

export function NavBarSelect({ children, className, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={cx('ds-navbar__select fontsize-x-regular', className)} aria-haspopup="listbox" aria-expanded={false} {...rest}>
      {children}<Icon name="expand_more" />
    </button>
  );
}

export interface BreadcrumbItem { label: string; href?: string; icon?: string; onClick?: () => void }
/** Caminho de navegação; o último item é a página atual. */
export function Breadcrumb({ items, 'aria-label': aria = 'Você está em' }: { items: BreadcrumbItem[]; 'aria-label'?: string }) {
  return (
    <ol className="ds-breadcrumb fontsize-x-regular" aria-label={aria}>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <li className="ds-breadcrumb__item" key={it.label} aria-current={last ? 'page' : undefined}>
            {last ? it.label : (
              <>
                <a className="ds-breadcrumb__link" href={it.href ?? '#'} onClick={it.onClick}>
                  {it.icon && <Icon name={it.icon} />}{it.label}
                </a>
                <Icon name="chevron_right" className="ds-breadcrumb__sep" />
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}
