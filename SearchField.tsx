import * as React from 'react';
import { cx, useControllable } from '../utils';
import { Icon } from './Icon';
import { Menu } from './Dropdown';

export interface SearchFieldProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Enter ou clique na lupa. */
  onSearch?: (value: string) => void;
  placeholder?: string;
  /** Aparência alternativa (fundo neutro). */
  alt?: boolean;
  /** Seleção integrada (ex.: escopo da busca). */
  select?: { options: string[]; value?: string; defaultValue?: string; onChange?: (v: string) => void };
  hint?: string;
  'aria-label'?: string;
  className?: string;
}

export function SearchField({
  value, defaultValue = '', onChange, onSearch, placeholder = 'Pesquisar', alt, select, hint = 'aperte enter', className, ...rest
}: SearchFieldProps) {
  const [val, setVal] = useControllable<string>(value, defaultValue, onChange);
  const [scope, setScope] = useControllable<string>(select?.value, select?.defaultValue ?? select?.options[0] ?? '', select?.onChange);
  const [focus, setFocus] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const root = React.useRef<HTMLDivElement>(null);
  const input = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', down);
    return () => document.removeEventListener('mousedown', down);
  }, [open]);

  return (
    <div
      ref={root} role="search" className={cx('ds-search', alt && 'ds-search--alt', (focus || !!val || open) && 'is-active', className)}
      onFocus={() => setFocus(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocus(false); }}
    >
      {select && (
        <>
          <button type="button" className="ds-search__select fontsize-x-regular" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(!open)}>
            {scope}<Icon name="expand_more" />
          </button>
          <span className="ds-search__divider" />
        </>
      )}
      <button type="button" className="ds-search__clear" aria-label="Limpar busca" onClick={() => { setVal(''); input.current?.focus(); }}>
        <Icon name="close" />
      </button>
      <div className="ds-search__field">
        <input
          ref={input} className="ds-search__input fontsize-x-regular" type="search" placeholder={placeholder}
          aria-label={rest['aria-label'] ?? placeholder} value={val}
          onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') onSearch?.(val); }}
        />
      </div>
      {hint && <span className="ds-search__hint fontsize-x-regular">{hint}</span>}
      <Icon name="search" />
      {select && open && (
        <Menu variant="simple" items={select.options.map((o) => ({ value: o, label: o }))} value={scope}
          onSelect={(v) => { setScope(v); setOpen(false); }} />
      )}
    </div>
  );
}
