import * as React from 'react';
import { cx, useControllable, useUid } from '../utils';

export interface SliderProps {
  label: string;
  /** Número = um valor; [min, max] = intervalo. */
  value?: number | [number, number];
  defaultValue?: number | [number, number];
  onChange?: (value: number | [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Segmentado (segmentos de 5% com 2px de intervalo; passo padrão 5). */
  segmented?: boolean;
  disabled?: boolean;
  /** Formata os valores exibidos (padrão: "n%"). */
  format?: (v: number) => string;
  className?: string;
}

export function Slider({
  label, value, defaultValue, onChange, min = 0, max = 100, step, segmented, disabled, format = (v) => `${v}%`, className,
}: SliderProps) {
  const id = useUid('sl');
  const initial = defaultValue ?? (Array.isArray(value) ? value : value ?? min);
  const [cur, setCur] = useControllable<number | [number, number]>(value, initial, onChange);
  const range = Array.isArray(cur);
  const lo = range ? (cur as [number, number])[0] : min;
  const hi = range ? (cur as [number, number])[1] : (cur as number);
  const st = step ?? (segmented ? 5 : 1);
  const loTop = range && lo > (min + max) / 2;

  const style = { ['--min' as string]: min, ['--max' as string]: max, ['--lo' as string]: lo, ['--hi' as string]: hi } as React.CSSProperties;
  const input = (v: number, idx: 0 | 1, aria?: string) => (
    <input
      type="range" className="ds-slider__input" min={min} max={max} step={st} value={v} disabled={disabled}
      aria-label={aria} aria-labelledby={aria ? undefined : id}
      onChange={(e) => {
        const n = +e.target.value;
        if (!range) return setCur(n);
        const next: [number, number] = idx === 0 ? [Math.min(n, hi), hi] : [lo, Math.max(n, lo)];
        setCur(next);
      }}
    />
  );
  return (
    <div className={cx('ds-slider-field', className)}>
      <div className="ds-slider__head">
        <span className="ds-slider__label fontsize-m-regular" id={id}>{label}</span>
        <span className="ds-slider__value fontsize-m-regular">
          {range ? (<>entre <b className="fontsize-m-semi">{format(lo)}</b> e <b className="fontsize-m-semi">{format(hi)}</b></>) : <b className="fontsize-m-semi">{format(hi)}</b>}
        </span>
      </div>
      <div
        className={cx('ds-slider', range && 'ds-slider--range', segmented && 'ds-slider--steps', disabled && 'ds-slider--disabled', loTop && 'is-lo-top')}
        style={style} role={range ? 'group' : undefined} aria-labelledby={range ? id : undefined}
      >
        <div className="ds-slider__track"><div className="ds-slider__fill" /></div>
        {range ? (<>{input(lo, 0, `${label}, mínimo`)}{input(hi, 1, `${label}, máximo`)}</>) : input(hi, 0)}
      </div>
    </div>
  );
}
