import * as React from 'react';
import { cx } from '../utils';
import { Icon } from './Icon';

export interface TableColumn<T> {
  key: string;
  header: string;
  /** Conteúdo da célula (padrão: row[key]). */
  render?: (row: T) => React.ReactNode;
  /** Destaque negativo na célula (ex.: status obsoleto). */
  negative?: (row: T) => boolean;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  /** Coluna de ações no fim da linha (use TableAction). */
  actions?: (row: T) => React.ReactNode;
  /** Quantidade máxima de ações (reserva a largura do cabeçalho). */
  actionsCount?: number;
  /** Linha esmaecida (ex.: item obsoleto). */
  muted?: (row: T) => boolean;
  /** Com quadro: cabeçalho escuro e linhas alternadas. */
  framed?: boolean;
  'aria-label'?: string;
  className?: string;
}

export function Table<T>({ columns, rows, getRowKey, actions, actionsCount = 3, muted, framed, className, ...rest }: TableProps<T>) {
  return (
    <div className="ds-scroll ds-scroll--x">
      <div className={cx('ds-table', framed && 'ds-table--framed', className)} role="table" aria-label={rest['aria-label']}>
        <div role="rowgroup">
          <div className="ds-table__row ds-table__row--head" role="row">
            {columns.map((c) => (
              <div className="ds-table__cell" role="columnheader" key={c.key}><span className="ds-table__head fontsize-m-regular">{c.header}</span></div>
            ))}
            {actions && (
              <div className="ds-table__cell ds-table__cell--actions" role="columnheader">
                <span className="ds-table__head fontsize-m-regular" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Ações</span>
                <span style={{ width: 36 * actionsCount + 32 }} />
              </div>
            )}
          </div>
        </div>
        <div className="ds-table__body" role="rowgroup">
          {rows.map((r) => (
            <div className={cx('ds-table__row', muted?.(r) && 'ds-table__row--muted')} role="row" key={getRowKey(r)}>
              {columns.map((c) => (
                <div className={cx('ds-table__cell', c.negative?.(r) && 'ds-table__cell--negative')} role="cell" key={c.key}>
                  <span className="fontsize-x-regular">{c.render ? c.render(r) : String((r as Record<string, unknown>)[c.key] ?? '')}</span>
                </div>
              ))}
              {actions && <div className="ds-table__cell ds-table__cell--actions" role="cell">{actions(r)}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export interface TableActionProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  icon: string;
  'aria-label': string;
}
/** Botão de ação de linha. */
export function TableAction({ icon, className, ...rest }: TableActionProps) {
  return <button type="button" className={cx('ds-table__action', className)} {...rest}><Icon name={icon} /></button>;
}
