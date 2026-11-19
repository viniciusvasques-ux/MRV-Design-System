import * as React from 'react';
import { cx } from '../utils';

export interface ActionBarProps {
  /** Botões de ação (lado principal). */
  children: React.ReactNode;
  /** Conteúdo do lado direito: toggle ou contador. */
  end?: React.ReactNode;
  /** fixed = fixa na base da tela; contained = fixa na base do contêiner pai; static = no fluxo. */
  position?: 'fixed' | 'contained' | 'static';
  className?: string;
}

export function ActionBar({ children, end, position = 'fixed', className }: ActionBarProps) {
  return (
    <div className={cx('ds-actionbar', position === 'static' && 'ds-actionbar--static', position === 'contained' && 'ds-actionbar--contained', className)}>
      <div className="ds-actionbar__actions">{children}</div>
      {end && <div className="ds-actionbar__end">{end}</div>}
    </div>
  );
}

/** Texto de apoio para o lado direito da barra (ex.: contador de selecionados). */
export function ActionBarText({ children }: { children: React.ReactNode }) {
  return <p className="ds-actionbar__text fontsize-x-regular" aria-live="polite">{children}</p>;
}
