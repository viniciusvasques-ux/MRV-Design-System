import * as React from 'react';
import { cx } from '../utils';
import { Icon } from './Icon';

export interface TooltipProps { children: React.ReactNode; className?: string; id?: string }
/** Dica simples (painel de texto). Posicionamento e gatilho ficam com quem a usa. */
export function Tooltip({ children, className, id }: TooltipProps) {
  return (
    <div className={cx('ds-tooltip', className)} role="tooltip" id={id}>
      <p className="ds-tooltip__text fontsize-xs-regular">{children}</p>
    </div>
  );
}

export interface TooltipListProps { items: string[]; onRemove?: (index: number) => void; 'aria-label'?: string; className?: string }
/** Dica interativa: lista com rolagem e remoção por item. */
export function TooltipList({ items, onRemove, className, ...rest }: TooltipListProps) {
  return (
    <div className={cx('ds-tooltip ds-tooltip--list', className)} role="group" aria-label={rest['aria-label'] ?? 'Lista'}>
      <div className="ds-tooltip__scroll" tabIndex={0}>
        {items.map((m, i) => (
          <div className="ds-tooltip__row" key={m + i}>
            <p className="ds-tooltip__text ds-tooltip__text--ellipsis fontsize-xs-regular">{m}</p>
            <button type="button" className="ds-tooltip__action ds-tooltip__action--sm" aria-label={`Remover ${m}`} onClick={() => onRemove?.(i)}>
              <Icon name="close" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface TooltipInfoSection { title: string; items: Array<{ code: string; alert?: boolean; href?: string }> }
export interface TooltipInfoProps { sections: TooltipInfoSection[]; 'aria-label'?: string; className?: string }
/** Dica interativa, variação 1: seções com itens e atalho para abrir. */
export function TooltipInfo({ sections, className, ...rest }: TooltipInfoProps) {
  return (
    <div className={cx('ds-tooltip ds-tooltip--info', className)} role="group" aria-label={rest['aria-label'] ?? 'Informações'}>
      {sections.map((s, si) => (
        <React.Fragment key={s.title}>
          {si > 0 && <hr className="ds-tooltip__divider" />}
          <div className="ds-tooltip__section">
            <p className="ds-tooltip__title fontsize-x-semi">{s.title}</p>
            {s.items.map((it) => (
              <div className="ds-tooltip__item" key={it.code}>
                <span className={cx('ds-tooltip__dot', it.alert && 'ds-tooltip__dot--alert')} aria-hidden="true" />
                <p className="ds-tooltip__text fontsize-xs-regular">{it.code}</p>
                <a className="ds-tooltip__action" href={it.href ?? '#'} aria-label={`Abrir ${it.code}`}><Icon name="open_in_new" /></a>
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export interface TooltipDetailProps {
  title: string;
  meta: Array<{ label: string; value: string; copyable?: boolean }>;
  className?: string;
}
/** Dica interativa, variação 2: título e pares rótulo/valor, com cópia opcional. */
export function TooltipDetail({ title, meta, className }: TooltipDetailProps) {
  return (
    <div className={cx('ds-tooltip ds-tooltip--detail', className)} role="group" aria-label={title}>
      <div className="ds-tooltip__head">
        <span className="ds-tooltip__dot" aria-hidden="true" />
        <p className="ds-tooltip__title fontsize-x-semi" style={{ fontSize: 12 }}>{title}</p>
      </div>
      {meta.map((m) => (
        <div className={cx('ds-tooltip__meta fontsize-xs-regular', m.copyable && 'ds-tooltip__meta--action')} key={m.label}>
          <span>{m.label}:</span>
          <span className={cx(m.copyable && 'ds-tooltip__text ds-tooltip__text--ellipsis')}>{m.value}</span>
          {m.copyable && (
            <button type="button" className="ds-tooltip__action" aria-label={`Copiar ${m.label}`} onClick={() => navigator.clipboard?.writeText(m.value)}>
              <Icon name="content_copy" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
