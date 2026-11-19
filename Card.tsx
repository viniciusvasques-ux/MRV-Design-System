import * as React from 'react';
import { cx } from '../utils';
import { Icon } from './Icon';

type Div = React.HTMLAttributes<HTMLElement>;
const el = (Tag: 'div' | 'article' | 'p' | 'span' | 'hr', base: string) =>
  function Part({ className, ...rest }: Div) {
    return React.createElement(Tag, { className: cx(base, className), ...rest });
  };

/** Cartão base: padding 16, raio 24, sem borda, sombra suave, 12px entre blocos. */
export const Card = el('article', 'ds-card');
/** Grade responsiva de cartões (24px entre eles). */
export const CardGrid = el('div', 'ds-card-grid');
export const CardRow = el('div', 'ds-card__row fontsize-x-regular');
export const CardSplit = el('div', 'ds-card__split fontsize-x-regular');
export const CardFooter = el('div', 'ds-card__footer');
export const CardNote = el('div', 'ds-card__note fontsize-x-regular');
export const CardPills = el('div', 'ds-card__pills fontsize-x-regular');
export const CardLabel = el('p', 'ds-card__label fontsize-x-semi');
export const CardValue = el('p', 'ds-card__value');
export function CardDivider(props: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className={cx('ds-card__divider', props.className)} />;
}
export function CardPill({ className, ...rest }: Div) {
  return <span className={cx('ds-card__pill fontsize-x-semi', className)} {...rest} />;
}

export interface CardTitleProps extends Div { brand?: boolean; icon?: string; size?: 'm' | 'l' }
export function CardTitle({ brand, icon, size = 'm', className, children, ...rest }: CardTitleProps) {
  return (
    <p className={cx('ds-card__title', brand && 'ds-card__title--brand', size === 'l' ? 'fontsize-l-semi' : 'fontsize-m-semi', className)} {...rest}>
      {icon && <Icon name={icon} />}{children}
    </p>
  );
}

export interface CardHeaderProps { icon?: string; title?: React.ReactNode; subtitle?: React.ReactNode; action?: React.ReactNode }
export function CardHeader({ icon, title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="ds-card__header">
      {icon && <span className="ds-card__icon-tile"><Icon name={icon} /></span>}
      <div className="ds-card__heading">
        {title && <p className="ds-card__title fontsize-m-semi">{title}</p>}
        {subtitle && <p className="ds-card__subtitle fontsize-x-regular">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardField({ label, children }: { label: string; children: React.ReactNode }) {
  return <dl className="ds-card__field fontsize-x-regular"><dt>{label}:</dt><dd>{children}</dd></dl>;
}

export function CardStat({ children }: { children: React.ReactNode }) {
  return <p className="ds-card__stat fontsize-title-s-heavy">{children}</p>;
}

export function CardDelta({ value, label }: { value: string; label?: string }) {
  const up = !value.trim().startsWith('-');
  return (
    <div className="ds-card__delta fontsize-x-regular">
      <b><Icon name={up ? 'arrow_upward' : 'arrow_downward'} size="s" />{value}</b>
      {label && <span>{label}</span>}
    </div>
  );
}

export function CardBadge({ tone, children }: { tone?: 'alert' | 'positive'; children: React.ReactNode }) {
  return <span className={cx('ds-card__badge fontsize-x-regular', tone && `ds-card__badge--${tone}`)}>{children}</span>;
}

export interface CardBarProps { value: number; tone?: 'positive'; label: string }
export function CardBar({ value, tone, label }: CardBarProps) {
  return (
    <div
      className={cx('ds-card__bar', tone && `ds-card__bar--${tone}`)} style={{ ['--v' as string]: value } as React.CSSProperties}
      role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}
    />
  );
}

/** Cabeça de medidor: rótulo e valor lado a lado. */
export function CardMeterHead({ label, value }: { label: React.ReactNode; value?: React.ReactNode }) {
  return <div className="ds-card__meter-head fontsize-x-regular"><span>{label}</span>{value != null && <span>{value}</span>}</div>;
}

export function CardMeter({ icon, ...bar }: CardBarProps & { icon: string }) {
  return <div className="ds-card__meter"><Icon name={icon} /><CardBar {...bar} /></div>;
}

export function CardMedia({ flag, children }: { flag?: string; children: React.ReactNode }) {
  return (
    <div className="ds-card__media">
      {children}
      {flag && <span className="ds-card__flag"><Icon name={flag} /></span>}
    </div>
  );
}

export interface CardTableProps { columns: string[]; rows: string[][]; total?: string[] }
export function CardTable({ columns, rows, total }: CardTableProps) {
  return (
    <table className="ds-card__table fontsize-x-regular">
      <thead><tr><th />{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
      <tbody>{rows.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
      {total && <tfoot><tr>{total.map((c, i) => <td key={i}>{c}</td>)}</tr></tfoot>}
    </table>
  );
}
