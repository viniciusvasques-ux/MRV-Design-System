import * as React from 'react';
import { cx, useUid } from '../utils';
import { Icon } from './Icon';

export interface ProgressBarProps {
  label: string;
  /** 0 a 100. */
  value: number;
  /** running = em andamento; waiting = em espera; done = concluído. */
  state?: 'running' | 'waiting' | 'done';
  /** Texto do valor; o padrão é "n%", "Em espera" ou "Concluído". */
  valueText?: string;
  /** Mostra o botão de cancelar (estado em andamento). */
  onCancel?: () => void;
  className?: string;
}

function level(v: number) { return v <= 0 ? 'empty' : v <= 25 ? 'low' : v <= 50 ? 'medium' : v <= 75 ? 'high' : 'full'; }

export function ProgressBar({ label, value, state = 'running', valueText, onCancel, className }: ProgressBarProps) {
  const id = useUid('pb');
  const v = Math.min(100, Math.max(0, value));
  const text = valueText ?? (state === 'waiting' ? 'Em espera' : state === 'done' ? 'Concluído' : `${Math.round(v)}%`);
  let action: React.ReactNode = null;
  if (state === 'waiting') action = <span className="ds-progress__action" aria-hidden="true"><Icon name="arrow_downward" /></span>;
  else if (state === 'done') action = <span className="ds-progress__action" aria-hidden="true"><Icon name="check" /></span>;
  else if (onCancel) action = <button type="button" className="ds-progress__action" aria-label="Cancelar" onClick={onCancel}><Icon name="close" /></button>;
  return (
    <div className={cx('ds-progress', state === 'waiting' && 'ds-progress--waiting', className)} data-level={level(v)} style={{ ['--v' as string]: v } as React.CSSProperties}>
      <div className="ds-progress__head fontsize-x-regular">
        <span id={`${id}-l`}>{label}</span>
        <span className="ds-progress__value">{text}</span>
      </div>
      <div className="ds-progress__row">
        <div className="ds-progress__track" role="progressbar" aria-labelledby={`${id}-l`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v)} aria-valuetext={text}>
          <div className="ds-progress__fill" />
        </div>
        {action}
      </div>
    </div>
  );
}
