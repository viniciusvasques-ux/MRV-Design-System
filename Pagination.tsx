import * as React from 'react';
import { useControllable, useUid } from '../utils';
import { Icon } from './Icon';

export interface PaginationProps {
  /** Total de itens. */
  total: number;
  page?: number;
  defaultPage?: number;
  perPage?: number;
  defaultPerPage?: number;
  perPageOptions?: number[];
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  disabled?: boolean;
}

export function Pagination({
  total, page, defaultPage = 1, perPage, defaultPerPage = 10, perPageOptions = [10, 20, 50], onPageChange, onPerPageChange, disabled,
}: PaginationProps) {
  const id = useUid('pg');
  const [per, setPer] = useControllable<number>(perPage, defaultPerPage, onPerPageChange);
  const [pg, setPg] = useControllable<number>(page, defaultPage, onPageChange);
  const pages = Math.max(1, Math.ceil(total / per));
  const cur = Math.min(pages, Math.max(1, pg));
  const [draft, setDraft] = React.useState(String(cur));
  const [status, setStatus] = React.useState('');
  React.useEffect(() => setDraft(String(cur)), [cur]);

  const go = (v: number, announce = true) => {
    const n = Math.min(pages, Math.max(1, v));
    if (n !== cur) { setPg(n); if (announce) { setStatus(''); window.setTimeout(() => setStatus(`Página ${n} de ${pages}`), 50); } }
    else setDraft(String(cur));
  };
  const commit = () => { const v = parseInt(draft, 10); go(Number.isNaN(v) ? cur : v); };
  const nav = (name: string, label: string, to: number, off: boolean) => (
    <button type="button" className="ds-pager__btn" aria-label={label} disabled={disabled || off} onClick={() => go(to)}><Icon name={name} /></button>
  );

  return (
    <nav className="ds-pager" aria-label="Paginação">
      <label className="ds-pager__label fontsize-x-regular" htmlFor={`${id}-pp`}>Itens por página:</label>
      <select
        className="ds-pager__box fontsize-x-regular" id={`${id}-pp`} value={per} disabled={disabled}
        onChange={(e) => { setPer(+e.target.value); setPg(1); }}
      >
        {perPageOptions.map((v) => <option key={v} value={v}>{v}</option>)}
      </select>
      <label className="ds-pager__label fontsize-x-regular" htmlFor={`${id}-pg`}>Página</label>
      <input
        className="ds-pager__box fontsize-x-regular" id={`${id}-pg`} type="text" inputMode="numeric" pattern="[0-9]*" value={draft} disabled={disabled}
        onChange={(e) => setDraft(e.target.value.replace(/\D/g, ''))} onKeyDown={(e) => { if (e.key === 'Enter') commit(); }} onBlur={commit}
      />
      <span className="ds-pager__label fontsize-x-regular">de {pages}</span>
      <span className="ds-pager__nav">
        {nav('keyboard_double_arrow_left', 'Primeira página', 1, cur <= 1)}
        {nav('chevron_left', 'Página anterior', cur - 1, cur <= 1)}
        {nav('chevron_right', 'Próxima página', cur + 1, cur >= pages)}
        {nav('keyboard_double_arrow_right', 'Última página', pages, cur >= pages)}
      </span>
      <span className="ds-pager__status" role="status" aria-live="polite">{status}</span>
    </nav>
  );
}
