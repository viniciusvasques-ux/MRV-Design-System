import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

/** Junta classes ignorando valores vazios. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

let counter = 0;
const reactUseId = (React as unknown as { useId?: () => string }).useId;
/** Id estável (React 18 usa useId; React 17 usa contador). */
export function useUid(prefix = 'ds'): string {
  if (reactUseId) return prefix + reactUseId().replace(/:/g, '');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [id] = useState(() => `${prefix}${++counter}`);
  return id;
}

/** Estado controlado ou não controlado. */
export function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (v: T) => void,
): [T, (v: T) => void] {
  const [inner, setInner] = useState<T>(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? (value as T) : inner;
  const set = useCallback(
    (v: T) => {
      if (!controlled) setInner(v);
      onChange?.(v);
    },
    [controlled, onChange],
  );
  return [current, set];
}

export function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> {
  return (node) => {
    refs.forEach((r) => {
      if (typeof r === 'function') r(node);
      else if (r) (r as React.MutableRefObject<T | null>).current = node;
    });
  };
}

const FOCUSABLE =
  'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Controle de camada (modal, drawer): montagem com animação de saída,
 * Esc, foco inicial, armadilha de foco e retorno do foco.
 */
export function useLayer(open: boolean, onClose?: () => void) {
  const [rendered, setRendered] = useState(open);
  const [leaving, setLeaving] = useState(false);
  const backdrop = useRef<HTMLDivElement | null>(null);
  const panel = useRef<HTMLElement | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      opener.current = document.activeElement as HTMLElement | null;
      setRendered(true);
      setLeaving(false);
      return;
    }
    if (!rendered) return;
    setLeaving(true);
    const end = () => {
      setRendered(false);
      setLeaving(false);
      opener.current?.focus?.({ preventScroll: true });
    };
    const t = window.setTimeout(end, 400);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open || !rendered) return;
    const p = panel.current;
    const first = p?.querySelector<HTMLElement>('[data-autofocus]') ?? p?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
        return;
      }
      if (e.key !== 'Tab' || !p) return;
      const items = Array.from(p.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const a = items[0];
      const z = items[items.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, rendered, onClose]);

  const onBackdropMouseDown = (e: React.MouseEvent) => {
    if (e.target === backdrop.current) onClose?.();
  };
  return { rendered, leaving, backdrop, panel, onBackdropMouseDown };
}
