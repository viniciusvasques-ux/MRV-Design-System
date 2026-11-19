import * as React from 'react';
import { cx, useControllable } from '../utils';

export interface GanttValue {
  /** Início. */
  p1: number;
  /** Quebra ou início de segundo ciclo (opcional). */
  p2?: number | null;
  /** Início da execução (barra). */
  b1: number;
  /** Fim da execução (barra). */
  b2: number;
}

export interface GanttSliderProps {
  value?: GanttValue;
  defaultValue?: GanttValue;
  onChange?: (value: GanttValue) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Linhas de 8px (telas de modelo). */
  compact?: boolean;
  /** Barra em verde escuro. */
  dark?: boolean;
  disabled?: boolean;
  /** Mostra o rótulo do fim da execução. */
  endLabel?: boolean;
  /** Formata os rótulos (padrão: "n m"). */
  format?: (v: number) => string;
  className?: string;
}

type Key = 'p1' | 'p2' | 'b1' | 'b2';

/** Controle de cronograma: início (círculo 1), quebra de ciclo (círculo 2) e período de execução (barra). */
export function GanttSlider({
  value, defaultValue = { p1: 0, b1: 10, b2: 30 }, onChange, min = 0, max = 48, step = 1, compact, dark, disabled, endLabel, format = (v) => `${v}m`, className,
}: GanttSliderProps) {
  const [s, setS] = useControllable<GanttValue>(value, defaultValue, onChange);
  const track = React.useRef<HTMLDivElement>(null);
  const hasP2 = s.p2 != null;
  const drag = React.useRef<{ k: Key | 'bar'; x: number; b1: number } | null>(null);
  const [dragging, setDragging] = React.useState(false);

  const lim = (k: Key): [number, number] => {
    const pre = hasP2 ? (s.p2 as number) : s.p1;
    if (k === 'p1') return [min, hasP2 ? (s.p2 as number) : s.b1];
    if (k === 'p2') return [s.p1, s.b1];
    if (k === 'b1') return [pre, s.b2];
    return [s.b1, max];
  };
  const snap = (v: number) => Math.round(v / step) * step;
  const set = (k: Key, v: number) => { const [a, b] = lim(k); setS({ ...s, [k]: Math.min(b, Math.max(a, snap(v))) }); };
  const moveBar = (b1: number) => {
    const w = s.b2 - s.b1, lo = hasP2 ? (s.p2 as number) : s.p1;
    const n = Math.max(lo, Math.min(max - w, snap(b1)));
    setS({ ...s, b1: n, b2: n + w });
  };

  const onDown = (e: React.PointerEvent) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-k]');
    if (!t || disabled) return;
    drag.current = { k: t.dataset.k as Key | 'bar', x: e.clientX, b1: s.b1 };
    t.setPointerCapture(e.pointerId);
    t.focus({ preventScroll: true });
    setDragging(true);
    e.preventDefault();
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || !track.current) return;
    const r = track.current.getBoundingClientRect();
    const handle = track.current.querySelector<HTMLElement>('[data-k="b1"]');
    const w = handle?.offsetWidth ?? 20;
    const per = (max - min) / (r.width - w);
    if (d.k === 'bar') moveBar(d.b1 + (e.clientX - d.x) * per);
    else set(d.k, min + (e.clientX - r.left - w / 2) * per);
  };
  const end = () => { drag.current = null; setDragging(false); };
  const onKey = (e: React.KeyboardEvent) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-k]');
    if (!t || disabled) return;
    const k = t.dataset.k as Key | 'bar';
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0;
    if (!dir && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    const mult = step * (e.shiftKey ? 5 : 1);
    if (k === 'bar') return moveBar(s.b1 + dir * mult);
    const [a, b] = lim(k);
    set(k, e.key === 'Home' ? a : e.key === 'End' ? b : s[k]! + dir * mult);
  };

  const aria = (k: Key) => {
    const [a, b] = lim(k);
    return { 'aria-valuemin': a, 'aria-valuemax': b, 'aria-valuenow': s[k] ?? 0, 'aria-valuetext': format(s[k] ?? 0) };
  };
  const dis = disabled ? ({ tabIndex: -1, 'aria-disabled': true } as const) : {};
  const label = (k: Key) => <span className="ds-gantt__label fontsize-x-regular" aria-hidden="true">{format(s[k] ?? 0)}</span>;
  const style = {
    ['--min' as string]: min, ['--max' as string]: max, ['--p1' as string]: s.p1, ['--b1' as string]: s.b1, ['--b2' as string]: s.b2,
    ...(hasP2 ? { ['--p2' as string]: s.p2 } : {}),
  } as React.CSSProperties;

  return (
    <div className={cx('ds-gantt', compact && 'ds-gantt--compact', dark && 'ds-gantt--dark', disabled && 'ds-gantt--disabled', dragging && 'is-dragging', className)} style={style}>
      <div className="ds-gantt__track" ref={track} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={end} onPointerCancel={end} onKeyDown={onKey}>
        <span className="ds-gantt__line" />
        <div
          className="ds-gantt__bar" role="slider" data-k="bar" aria-label="Período de execução" tabIndex={disabled ? -1 : 0}
          aria-valuemin={min} aria-valuemax={max} aria-valuenow={s.b1} aria-valuetext={`de ${format(s.b1)} a ${format(s.b2)}`} aria-disabled={disabled || undefined}
        >
          <button type="button" className="ds-gantt__handle ds-gantt__handle--start" role="slider" data-k="b1" aria-label="Início da execução" {...aria('b1')} {...dis}>{label('b1')}</button>
          <button type="button" className="ds-gantt__handle ds-gantt__handle--end" role="slider" data-k="b2" aria-label="Fim da execução" {...aria('b2')} {...dis}>{endLabel && label('b2')}</button>
        </div>
        <button type="button" className="ds-gantt__dot ds-gantt__dot--start" role="slider" data-k="p1" aria-label="Data de início" {...aria('p1')} {...dis}>{label('p1')}</button>
        {hasP2 && (
          <button type="button" className="ds-gantt__dot ds-gantt__dot--cycle" role="slider" data-k="p2" aria-label="Quebra ou início de segundo ciclo" {...aria('p2')} {...dis}>{label('p2')}</button>
        )}
      </div>
    </div>
  );
}
