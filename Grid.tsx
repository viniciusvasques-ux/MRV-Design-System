import * as React from 'react';
import { cx } from '../utils';

export interface PageGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** dense = modelo denso do desktop (gutter e margens de 8px); padrão = modelo padrão. */
  dense?: boolean;
  /** Compensa a altura do cabeçalho fixo (px). */
  offsetTop?: number;
  /** Reserva espaço para uma ActionBar fixa na base (px), para o fim da página não ficar encoberto. */
  offsetBottom?: number;
}

/**
 * Grade de colunas da página: 4 colunas no smartphone, 8 no tablet e 12 no desktop,
 * com gutter, margem lateral e margem de topo e base por breakpoint (600 e 1024px).
 */
export function PageGrid({ dense, offsetTop, offsetBottom, className, style, ...rest }: PageGridProps) {
  const pad: React.CSSProperties = {
    ...(offsetTop ? { paddingTop: `calc(${offsetTop}px + var(--ds-pg-my))` } : {}),
    ...(offsetBottom ? { paddingBottom: `calc(${offsetBottom}px + var(--ds-pg-my))` } : {}),
  };
  return (
    <div
      className={cx('ds-page-grid', dense && 'ds-page-grid--dense', className)}
      style={{ ...pad, ...style }}
      {...rest}
    />
  );
}

export interface GridColProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Colunas ocupadas no desktop (de 12). Tablet e smartphone ocupam a linha toda. */
  span?: number;
  /** Colunas ocupadas no tablet (de 8); omitido = linha toda. */
  tabletSpan?: number;
}
export function GridCol({ span = 12, tabletSpan, className, style, ...rest }: GridColProps) {
  return (
    <div
      className={cx('ds-page-grid__col', className)}
      style={{ ['--span' as string]: span, ...(tabletSpan ? { ['--span-t' as string]: tabletSpan } : {}), ...style } as React.CSSProperties}
      {...rest}
    />
  );
}
