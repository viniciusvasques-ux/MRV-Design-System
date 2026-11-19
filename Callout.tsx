import * as React from 'react';
import { cx, useControllable, useUid } from '../utils';
import { Icon } from './Icon';

export type CalloutTone = 'alert' | 'positive' | 'negative' | 'accent';

export interface CalloutProps {
  tone?: CalloutTone;
  /** Ícone (nome do Material Symbol). */
  icon?: string;
  /** Com título e interruptor (versão completa). */
  title?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Descrição em tom secundário, alinhada ao topo (versão completa). */
  muted?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Callout({
  tone = 'alert', icon = 'info', title, checked, defaultChecked = true, onCheckedChange, muted, children, className,
}: CalloutProps) {
  const id = useUid('co');
  const [on, setOn] = useControllable<boolean>(checked, defaultChecked, onCheckedChange);
  if (title == null) {
    return (
      <div className={cx('ds-callout', `ds-callout--${tone}`, className)} role="note">
        <Icon name={icon} className="ds-callout__icon" />
        <p className="ds-callout__text fontsize-x-regular">{children}</p>
      </div>
    );
  }
  return (
    <div className={cx('ds-callout', `ds-callout--${tone}`, 'ds-callout--toggle', !on && 'is-off', className)}>
      <div className="ds-callout__head">
        <p className="ds-callout__title fontsize-x-semi" id={`${id}-l`}>{title}</p>
        <button type="button" role="switch" className="ds-toggle" aria-checked={on} aria-labelledby={`${id}-l`} aria-describedby={`${id}-d`} onClick={() => setOn(!on)}>
          <span className="ds-toggle__knob" />
        </button>
      </div>
      <div className={cx('ds-callout__desc', muted && 'ds-callout__desc--muted ds-callout__desc--start')} id={`${id}-d`}>
        <Icon name={icon} className="ds-callout__icon" />
        <p className="ds-callout__text fontsize-x-regular">{children}</p>
      </div>
    </div>
  );
}
