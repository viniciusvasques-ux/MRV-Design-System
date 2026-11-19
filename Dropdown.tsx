import * as React from 'react';
import { cx, useControllable, useUid } from '../utils';
import { Icon } from './Icon';

export interface MenuOption {
  value: string;
  label: React.ReactNode;
  /** Ícone à esquerda (lista complexa). */
  icon?: string;
  disabled?: boolean;
}

export interface MenuProps {
  /**
   * complex = lista com título e ícones; simple = lista compacta;
   * multiple = seleção múltipla com Limpar e Aplicar; single = seleção única (radio) com Aplicar.
   */
  variant?: 'complex' | 'simple' | 'multiple' | 'single';
  title?: string;
  items: MenuOption[];
  role?: 'listbox' | 'menu';
  /** Valor(es) selecionado(s) (multiple: string[]; single: string). */
  value?: string | string[];
  /** Clique em item (complex e simple). */
  onSelect?: (value: string) => void;
  /** Aplicar (multiple e single). */
  onApply?: (value: string[] | string) => void;
  onClear?: () => void;
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** Painel de opções do Dropdown. Posicionamento e abertura ficam com quem o usa (veja Select). */
export function Menu({ variant = 'simple', title, items, role = 'listbox', value, onSelect, onApply, onClear, className, style, ...rest }: MenuProps) {
  const uid = useUid('mn');
  const label = rest['aria-label'] ?? title;
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  const [draft, setDraft] = React.useState<string[]>(selected);
  React.useEffect(() => setDraft(selected), [selected.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps
  const list = React.useRef<HTMLUListElement>(null);

  if (variant === 'multiple' || variant === 'single') {
    const radio = variant === 'single';
    return (
      <div className={cx('ds-menu ds-menu--actions', className)} style={style}>
        <div className="ds-menu__group" role={radio ? 'radiogroup' : 'group'} aria-label={label}>
          {items.map((o) => (
            <label className="ds-menu__item" key={o.value}>
              <input
                className="ds-check__native" type={radio ? 'radio' : 'checkbox'} name={uid} value={o.value}
                checked={draft.includes(o.value)} disabled={o.disabled}
                onChange={(e) =>
                  setDraft(radio ? [o.value] : e.target.checked ? [...draft, o.value] : draft.filter((x) => x !== o.value))
                }
              />
              <span className={cx('ds-check', radio && 'ds-check--radio')} aria-hidden="true" />
              <span className="fontsize-x-regular">{o.label}</span>
            </label>
          ))}
        </div>
        <div className="ds-menu__actions">
          {!radio && (
            <button type="button" className="ds-menu__btn ds-menu__btn--clear fontsize-x-semi" onClick={() => { setDraft([]); onClear?.(); }}>
              Limpar<Icon name="close" />
            </button>
          )}
          <button type="button" className="ds-menu__btn ds-menu__btn--apply fontsize-x-semi" onClick={() => onApply?.(radio ? draft[0] ?? '' : draft)}>
            Aplicar<Icon name="check" />
          </button>
        </div>
      </div>
    );
  }

  const move = (e: React.KeyboardEvent, i: number) => {
    const els = Array.from(list.current?.querySelectorAll<HTMLElement>('[role=option],[role=menuitem]') ?? []);
    if (e.key === 'ArrowDown') { e.preventDefault(); els[(i + 1) % els.length]?.focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); els[(i - 1 + els.length) % els.length]?.focus(); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!items[i].disabled) onSelect?.(items[i].value); }
  };
  return (
    <div className={cx('ds-menu', variant === 'simple' && 'ds-menu--compact', className)} style={style}>
      {variant === 'complex' && title && <p className="ds-menu__title fontsize-m-semi">{title}</p>}
      <ul className="ds-menu__list" role={role} aria-label={label} ref={list}>
        {items.map((o, i) => (
          <li
            key={o.value} className="ds-menu__item" tabIndex={-1} role={role === 'menu' ? 'menuitem' : 'option'}
            aria-selected={role === 'listbox' ? selected.includes(o.value) : undefined} aria-disabled={o.disabled || undefined}
            onClick={() => !o.disabled && onSelect?.(o.value)} onKeyDown={(e) => move(e, i)}
          >
            {variant === 'complex' && o.icon && <Icon name={o.icon} size="l" />}
            <span className="fontsize-x-regular">{o.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export interface SelectProps {
  label: string;
  placeholder?: string;
  options: MenuOption[];
  /** Seleção múltipla com checkbox, Limpar e Aplicar. Sem isto, seleção única com Aplicar. */
  multiple?: boolean;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  helper?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

/** Campo com painel Dropdown: combina o campo de texto e o Menu de seleção. */
export function Select({ label, placeholder, options, multiple, value, defaultValue = [], onChange, helper, disabled, className }: SelectProps) {
  const [cur, setCur] = useControllable<string[]>(value, defaultValue, onChange);
  const [open, setOpen] = React.useState(false);
  const root = React.useRef<HTMLDivElement>(null);
  const input = React.useRef<HTMLInputElement>(null);
  const id = useUid('sel');
  const text = cur.map((v) => options.find((o) => o.value === v)?.label).filter((l) => typeof l === 'string').join(', ');

  React.useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', down);
    return () => document.removeEventListener('mousedown', down);
  }, [open]);

  const close = (focus = true) => { setOpen(false); if (focus) input.current?.focus(); };
  return (
    <div
      className={cx('ds-select', open && 'is-open', className)} ref={root}
      onKeyDown={(e) => { if (e.key === 'Escape' && open) { e.stopPropagation(); close(); } }}
    >
      <div className={cx('ds-field', open && 'ds-field--selected', disabled && 'ds-field--disabled')}>
        <div className="ds-field__head"><label className="ds-field__label fontsize-x-regular" htmlFor={id}>{label}</label></div>
        <div className="ds-field__box" onMouseDown={(e) => { if (disabled) return; e.preventDefault(); setOpen(!open); input.current?.focus(); }}>
          <input
            ref={input} id={id} className="ds-field__input fontsize-x-regular" readOnly role="combobox" aria-haspopup="listbox"
            aria-expanded={open} aria-controls={`${id}-m`} placeholder={placeholder} value={text} disabled={disabled}
            onKeyDown={(e) => { if (['Enter', ' ', 'ArrowDown'].includes(e.key)) { e.preventDefault(); setOpen(true); } }}
          />
          <Icon name="expand_more" className="ds-field__icon ds-field__icon--muted" />
        </div>
        {helper && <div className="ds-field__helper fontsize-xs-regular"><Icon name="info" size="s" /><span>{helper}</span></div>}
      </div>
      {open && (
        <div id={`${id}-m`} className="ds-select__panel">
          <Menu
            variant={multiple ? 'multiple' : 'single'} aria-label={label} items={options}
            value={cur} onClear={() => setCur([])}
            onApply={(v) => { setCur(Array.isArray(v) ? v : v ? [v] : []); close(); }}
          />
        </div>
      )}
    </div>
  );
}
