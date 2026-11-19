import * as React from 'react';
import { cx } from '../utils';

export interface ScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Eixo de rolagem (padrão: vertical). */
  axis?: 'x' | 'y' | 'both';
  /** Barra sempre visível em qualquer largura. */
  visible?: boolean;
}

/** Contêiner com a barra de rolagem do DS (no tablet e smartphone a barra aparece ao rolar). */
export const Scroll = React.forwardRef<HTMLDivElement, ScrollProps>(function Scroll({ axis = 'y', visible, className, onScroll, ...rest }, ref) {
  const [scrolling, setScrolling] = React.useState(false);
  const timer = React.useRef<number>();
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  return (
    <div
      ref={ref}
      className={cx('ds-scroll', axis !== 'both' && `ds-scroll--${axis}`, visible && 'ds-scroll--visible', scrolling && 'is-scrolling', className)}
      onScroll={(e) => {
        onScroll?.(e);
        setScrolling(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setScrolling(false), 800);
      }}
      {...rest}
    />
  );
});
