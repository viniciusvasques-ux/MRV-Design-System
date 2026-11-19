import * as React from 'react';
import { createPortal } from 'react-dom';
import { cx, useLayer, useUid } from '../utils';
import { Icon } from './Icon';

interface BaseProps {
  open: boolean;
  onClose?: () => void;
  title: string;
  /** Botões do rodapé, em linha e com a mesma largura. */
  actions?: React.ReactNode;
  className?: string;
}

export interface ModalProps extends BaseProps {
  /** Ícone do topo (nome do Material Symbol). */
  icon?: string;
  /** alertdialog para avisos que exigem resposta. */
  role?: 'dialog' | 'alertdialog';
  /** Texto de apoio. */
  children?: React.ReactNode;
}

/** Modal de aviso ou confirmação: ícone, título, texto e botões. */
export function Modal({ open, onClose, title, icon, role = 'dialog', actions, children, className }: ModalProps) {
  const id = useUid('md');
  const L = useLayer(open, onClose);
  if (!L.rendered || typeof document === 'undefined') return null;
  return createPortal(
    <div className={cx('ds-modal-backdrop', L.leaving && 'is-leaving')} ref={L.backdrop} onMouseDown={L.onBackdropMouseDown}>
      <div className={cx('ds-modal', className)} role={role} aria-modal="true" aria-labelledby={`${id}t`} aria-describedby={children ? `${id}d` : undefined} ref={L.panel as React.RefObject<HTMLDivElement>}>
        {icon && <Icon name={icon} className="ds-modal__icon" />}
        <h2 className="ds-modal__title fontsize-l-semi" id={`${id}t`}>{title}</h2>
        {children && <p className="ds-modal__text fontsize-x-regular" id={`${id}d`}>{children}</p>}
        {actions && <div className="ds-modal__actions">{actions}</div>}
      </div>
    </div>,
    document.body,
  );
}

export interface ModalWindowProps extends BaseProps {
  /** Largura acompanha o conteúdo (mínimo de 525px). */
  wide?: boolean;
  /** Largura máxima personalizada. */
  width?: number | string;
  children?: React.ReactNode;
}

/** Janela com cabeçalho, conteúdo variável e rodapé opcional. */
export function ModalWindow({ open, onClose, title, wide, width, actions, children, className }: ModalWindowProps) {
  const id = useUid('mw');
  const L = useLayer(open, onClose);
  if (!L.rendered || typeof document === 'undefined') return null;
  return createPortal(
    <div className={cx('ds-modal-backdrop', L.leaving && 'is-leaving')} ref={L.backdrop} onMouseDown={L.onBackdropMouseDown}>
      <div
        className={cx('ds-modal ds-modal--window', wide && 'ds-modal--wide', className)} style={width != null ? { width: `min(${typeof width === 'number' ? `${width}px` : width}, calc(100vw - 32px))` } : undefined}
        role="dialog" aria-modal="true" aria-labelledby={`${id}t`} ref={L.panel as React.RefObject<HTMLDivElement>}
      >
        <div className="ds-modal__header">
          <h2 className="ds-modal__heading fontsize-xl-regular" id={`${id}t`}>{title}</h2>
          <button type="button" className="ds-modal__close" aria-label="Fechar" onClick={onClose} data-autofocus><Icon name="close" /></button>
        </div>
        <div className="ds-modal__body">{children}</div>
        {actions && <div className="ds-modal__actions">{actions}</div>}
      </div>
    </div>,
    document.body,
  );
}
