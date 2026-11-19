import * as React from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../utils';
import { Icon } from './Icon';

export type ToastKind = 'info' | 'error' | 'success' | 'alert';
const ICONS: Record<ToastKind, string> = { info: 'info', error: 'cancel', success: 'check_circle', alert: 'error' };
const BICONS: Record<ToastKind, string> = { info: 'info', error: 'close', success: 'check', alert: 'warning' };

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  kind?: ToastKind; title: string; text: string; leaving?: boolean;
}
/** Cartão de aviso (canto inferior direito). Normalmente emitido por useToast(). */
export function Toast({ kind = 'info', title, text, leaving, className, ...rest }: ToastProps) {
  return (
    <div className={cx('ds-toast', `ds-toast--${kind}`, leaving && 'is-leaving', className)} role={kind === 'error' || kind === 'alert' ? 'alert' : 'status'} {...rest}>
      <Icon name={ICONS[kind]} className="ds-toast__icon" />
      <div className="ds-toast__body">
        <p className="ds-toast__title fontsize-m-semi">{title}</p>
        <p className="ds-toast__text fontsize-x-regular">{text}</p>
      </div>
    </div>
  );
}

export interface ToastBlockProps { kind?: ToastKind; children: React.ReactNode; onClose?: () => void; className?: string }
/** Faixa de aviso com bloqueio (desce do topo). */
export function ToastBlock({ kind = 'info', children, onClose, className }: ToastBlockProps) {
  return (
    <div className={cx('ds-toast-block', `ds-toast-block--${kind}`, className)}>
      <Icon name={BICONS[kind]} className="ds-toast-block__icon" />
      <p className="ds-toast-block__text fontsize-m-regular">{children}</p>
      <button type="button" className="ds-toast-block__close" aria-label="Fechar" onClick={onClose}><Icon name="close" /></button>
    </div>
  );
}

interface Item { id: number; kind: ToastKind; title: string; text: string; leaving: boolean }
interface Api {
  /** Mostra um aviso no canto inferior direito por 5 s (no máximo 10 ao mesmo tempo). */
  show: (kind: ToastKind, title: string, text: string) => void;
  /** Mostra a faixa com bloqueio de tela por 5 s ou até fechar. */
  block: (kind: ToastKind, text: string) => void;
}
const Ctx = React.createContext<Api | null>(null);

export function useToast(): Api {
  const c = React.useContext(Ctx);
  if (!c) throw new Error('useToast precisa estar dentro de <ToastProvider>.');
  return c;
}

const TOAST_MS = 5000;
const TOAST_MAX = 10;

export function ToastProvider({ children, duration = TOAST_MS }: { children: React.ReactNode; duration?: number }) {
  const [items, setItems] = React.useState<Item[]>([]);
  const [lock, setLock] = React.useState<{ kind: ToastKind; text: string; leaving: boolean } | null>(null);
  const seq = React.useRef(0);

  const dismiss = React.useCallback((id: number) => {
    setItems((l) => l.map((i) => (i.id === id ? { ...i, leaving: true } : i)));
    window.setTimeout(() => setItems((l) => l.filter((i) => i.id !== id)), 300);
  }, []);
  const closeLock = React.useCallback(() => {
    setLock((l) => (l ? { ...l, leaving: true } : l));
    window.setTimeout(() => setLock(null), 300);
  }, []);

  const api = React.useMemo<Api>(() => ({
    show(kind, title, text) {
      const id = ++seq.current;
      setItems((l) => {
        const live = l.filter((i) => !i.leaving);
        const over = live.slice(0, Math.max(0, live.length + 1 - TOAST_MAX)).map((i) => i.id);
        over.forEach((o) => window.setTimeout(() => dismiss(o), 0));
        return [...l, { id, kind, title, text, leaving: false }];
      });
      window.setTimeout(() => dismiss(id), duration);
    },
    block(kind, text) {
      setLock({ kind, text, leaving: false });
      window.setTimeout(closeLock, duration);
    },
  }), [dismiss, closeLock, duration]);

  return (
    <Ctx.Provider value={api}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <>
            <div className="ds-toast-region" aria-live="polite">
              {items.map((i) => <Toast key={i.id} kind={i.kind} title={i.title} text={i.text} leaving={i.leaving} />)}
            </div>
            {lock && (
              <div className={cx('ds-toast-lock', lock.leaving && 'is-leaving')} role="alert">
                <ToastBlock kind={lock.kind} onClose={closeLock}>{lock.text}</ToastBlock>
              </div>
            )}
          </>,
          document.body,
        )}
    </Ctx.Provider>
  );
}
