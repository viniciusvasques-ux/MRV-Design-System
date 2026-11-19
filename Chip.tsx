import * as React from 'react';
import { cx, useUid } from '../utils';
import { Icon } from './Icon';
import { Menu } from './Dropdown';

export interface ChipMenuItem { label: string; onSelect?: () => void }
export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Com linha (sem preenchimento). */
  outline?: boolean;
  /** Mostra o botão de remover. */
  onRemove?: () => void;
  /** Itens do menu de contexto (botão "mais opções"). */
  menuItems?: ChipMenuItem[];
}

export function Chip({ outline, onRemove, menuItems, className, children, ...rest }: ChipProps) {
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef<HTMLSpanElement>(null);
  const label = typeof children === 'string' ? children : '';
  React.useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', down);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('mousedown', down); document.removeEventListener('keydown', key); };
  }, [open]);
  const action = !!onRemove || !!menuItems;
  const chip = (
    <span className={cx('ds-chip fontsize-xs-regular', outline && 'ds-chip--outline', action && 'ds-chip--action', className)} {...rest}>
      {children}
      {onRemove && (
        <button type="button" className="ds-chip__remove" aria-label={`Remover ${label}`} onClick={onRemove}>
          <Icon name="close" size="s" />
        </button>
      )}
      {menuItems && (
        <button type="button" className="ds-chip__menu" aria-haspopup="menu" aria-expanded={open} aria-label={`Mais opções de ${label}`} onClick={() => setOpen(!open)}>
          <Icon name="more_vert" size="s" />
        </button>
      )}
    </span>
  );
  if (!menuItems) return chip;
  return (
    <span className="ds-chip-wrap" ref={wrap}>
      {chip}
      {open && (
        <Menu variant="simple" role="menu" items={menuItems.map((m) => ({ value: m.label, label: m.label }))}
          onSelect={(v) => { menuItems.find((m) => m.label === v)?.onSelect?.(); setOpen(false); }} />
      )}
    </span>
  );
}
