import * as React from 'react';
import { cx, useControllable } from '../utils';
import { Icon } from './Icon';

export interface TabItem { id: string; label: string; disabled?: boolean }
export interface TabsProps {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  'aria-label'?: string;
  className?: string;
}

/** Abas com rolagem horizontal, setas de navegação e teclado (← →). O painel de conteúdo fica com quem usa. */
export function Tabs({ tabs, value, defaultValue, onChange, className, ...rest }: TabsProps) {
  const [cur, setCur] = useControllable<string>(value, defaultValue ?? tabs.find((t) => !t.disabled)?.id ?? '', onChange);
  const list = React.useRef<HTMLDivElement>(null);
  const [nav, setNav] = React.useState({ over: false, start: true, end: true });

  const sync = React.useCallback(() => {
    const l = list.current;
    if (!l) return;
    setNav({ over: l.scrollWidth > l.clientWidth + 1, start: l.scrollLeft <= 0, end: l.scrollLeft + l.clientWidth >= l.scrollWidth - 1 });
  }, []);
  React.useEffect(() => {
    sync();
    const l = list.current;
    if (!l) return;
    l.addEventListener('scroll', sync);
    window.addEventListener('resize', sync);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(sync) : null;
    ro?.observe(l);
    return () => { l.removeEventListener('scroll', sync); window.removeEventListener('resize', sync); ro?.disconnect(); };
  }, [sync, tabs.length]);

  const select = (t: TabItem) => {
    setCur(t.id);
    requestAnimationFrame(() => {
      const el = list.current?.querySelector<HTMLElement>(`[data-tab="${CSS.escape(t.id)}"]`);
      el?.focus();
      el?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
  };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    for (let j = i + d; j >= 0 && j < tabs.length; j += d) if (!tabs[j].disabled) { select(tabs[j]); break; }
  };
  const scroll = (dir: number) => list.current?.scrollBy({ left: dir * list.current.clientWidth * 0.6 });

  return (
    <div className={cx('ds-tabs', className)}>
      <button type="button" className="ds-tabs__nav" aria-label="Abas anteriores" hidden={!nav.over} disabled={nav.start} onClick={() => scroll(-1)}>
        <Icon name="keyboard_double_arrow_left" />
      </button>
      <div className="ds-tabs__list" role="tablist" aria-label={rest['aria-label']} ref={list}>
        {tabs.map((t, i) => (
          <button
            key={t.id} type="button" role="tab" data-tab={t.id} disabled={t.disabled} aria-selected={cur === t.id}
            tabIndex={cur === t.id ? 0 : -1} className={cx('ds-tab', cur === t.id ? 'fontsize-x-semi' : 'fontsize-x-regular')}
            onClick={() => select(t)} onKeyDown={(e) => onKey(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <button type="button" className="ds-tabs__nav" aria-label="Próximas abas" hidden={!nav.over} disabled={nav.end} onClick={() => scroll(1)}>
        <Icon name="keyboard_double_arrow_right" />
      </button>
    </div>
  );
}
