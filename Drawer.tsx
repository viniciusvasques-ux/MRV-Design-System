import * as React from 'react';
import { createPortal } from 'react-dom';
import { cx, useLayer, useUid } from '../utils';
import { Icon } from './Icon';

export interface DrawerProps {
  open: boolean;
  onClose?: () => void;
  title: string;
  subtitle?: string;
  side?: 'right' | 'left';
  /** Largura reduzida (389px). */
  compact?: boolean;
  /** Fundo de superfície (cartões sobre o painel). */
  surface?: boolean;
  /** Botões do rodapé. */
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

/** Painel lateral deslizante, com cabeçalho, corpo rolável e rodapé de ações. */
export function Drawer({ open, onClose, title, subtitle, side = 'right', compact, surface, footer, children, className }: DrawerProps) {
  const id = useUid('dr');
  const L = useLayer(open, onClose);
  if (!L.rendered || typeof document === 'undefined') return null;
  return createPortal(
    <div className={cx('ds-drawer-backdrop', L.leaving && 'is-leaving')} ref={L.backdrop} onMouseDown={L.onBackdropMouseDown}>
      <aside
        className={cx('ds-drawer', `ds-drawer--${side}`, compact && 'ds-drawer--compact', surface && 'ds-drawer--surface', L.leaving && 'is-leaving', className)}
        role="dialog" aria-modal="true" aria-labelledby={`${id}t`} ref={L.panel as React.RefObject<HTMLElement>}
      >
        <div className="ds-drawer__header">
          <div className="ds-drawer__heading">
            <h2 className="ds-drawer__title fontsize-xl-regular" id={`${id}t`}>{title}</h2>
            {subtitle && <p className="ds-drawer__subtitle fontsize-x-regular">{subtitle}</p>}
          </div>
          <button type="button" className="ds-drawer__action" aria-label="Fechar" onClick={onClose} data-autofocus><Icon name="close" /></button>
        </div>
        <div className="ds-drawer__body">{children}</div>
        {footer && <div className="ds-drawer__footer">{footer}</div>}
      </aside>
    </div>,
    document.body,
  );
}

export function DrawerSection({ title, divider = true, children }: { title: string; divider?: boolean; children: React.ReactNode }) {
  return (
    <div className="ds-drawer__section">
      <h3 className="ds-drawer__section-title ds-drawer__section-title--brand fontsize-xl-regular">{title}</h3>
      {divider && <hr className="ds-drawer__divider" />}
      {children}
    </div>
  );
}
