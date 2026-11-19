import * as React from 'react';
import { cx, mergeRefs, useUid } from '../utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: React.ReactNode;
  /** Estado parcial (traço). */
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, indeterminate, className, ...rest },
  ref,
) {
  const inner = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (inner.current) inner.current.indeterminate = !!indeterminate;
  }, [indeterminate, rest.checked]);
  return (
    <label className={cx('ds-choice', className)}>
      <input ref={mergeRefs(ref, inner)} className="ds-check__native" type="checkbox" {...rest} />
      <span className="ds-check" aria-hidden="true" />
      {label != null && <span className="fontsize-x-regular">{label}</span>}
    </label>
  );
});

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: React.ReactNode;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio({ label, className, ...rest }, ref) {
  return (
    <label className={cx('ds-choice', className)}>
      <input ref={ref} className="ds-check__native" type="radio" {...rest} />
      <span className="ds-check ds-check--radio" aria-hidden="true" />
      {label != null && <span className="fontsize-x-regular">{label}</span>}
    </label>
  );
});

export interface RadioOption { value: string; label: React.ReactNode; disabled?: boolean }
export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  'aria-label'?: string;
  className?: string;
}

export function RadioGroup({ name, options, value, defaultValue, onChange, disabled, className, ...rest }: RadioGroupProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const current = value ?? inner;
  return (
    <div className={cx('ds-radio-group', className)} role="radiogroup" aria-label={rest['aria-label']} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map((o) => (
        <Radio
          key={o.value}
          name={name}
          value={o.value}
          label={o.label}
          checked={current === o.value}
          disabled={disabled || o.disabled}
          onChange={() => { setInner(o.value); onChange?.(o.value); }}
        />
      ))}
    </div>
  );
}

export interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'role'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Estado de alerta (aparência de atenção); some ao alternar. */
  alert?: boolean;
  label?: React.ReactNode;
}

/** Interruptor liga/desliga (role="switch"). */
export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { checked, defaultChecked = false, onCheckedChange, alert, label, className, onClick, disabled, ...rest },
  ref,
) {
  const [inner, setInner] = React.useState(defaultChecked);
  const [alerting, setAlerting] = React.useState(!!alert);
  React.useEffect(() => setAlerting(!!alert), [alert]);
  const on = checked ?? inner;
  const id = useUid('tg');
  const btn = (
    <button
      ref={ref}
      type="button"
      role="switch"
      className="ds-toggle"
      aria-checked={on}
      data-state={alerting ? 'alert' : undefined}
      disabled={disabled}
      aria-labelledby={label != null ? `${id}-l` : undefined}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        setAlerting(false);
        setInner(!on);
        onCheckedChange?.(!on);
      }}
      {...rest}
    >
      <span className="ds-toggle__knob" />
    </button>
  );
  if (label == null) return btn;
  return (
    <div className={cx('ds-switch', className)}>
      {btn}
      <span className="fontsize-x-regular" id={`${id}-l`}>{label}</span>
    </div>
  );
});

export type ThreeWayValue = 'a' | 'n' | 'b';
export interface ThreeWaySwitchProps {
  label: React.ReactNode;
  hint?: React.ReactNode;
  value?: ThreeWayValue;
  defaultValue?: ThreeWayValue;
  onChange?: (value: ThreeWayValue) => void;
  /** Rótulos das três posições. */
  labels?: { a: string; n: string; b: string };
  disabled?: boolean;
  name?: string;
}

/** Seletor de três posições: opção A, neutro e opção B. */
export function ThreeWaySwitch({
  label, hint, value, defaultValue = 'n', onChange, labels = { a: 'opção a', n: 'neutro', b: 'opção b' }, disabled, name,
}: ThreeWaySwitchProps) {
  const [inner, setInner] = React.useState<ThreeWayValue>(defaultValue);
  const cur = value ?? inner;
  const id = useUid('tw');
  const group = name ?? id;
  const opt = (v: ThreeWayValue) => (
    <label className="ds-three__opt fontsize-m-regular" key={v}>
      <input
        type="radio" className="ds-three__input" name={group} value={v} checked={cur === v} disabled={disabled}
        onChange={() => { setInner(v); onChange?.(v); }}
      />
      <span>{labels[v]}</span>
    </label>
  );
  return (
    <div className="ds-three-field">
      <div className="ds-three-field__head">
        <span className="ds-three-field__label fontsize-m-regular" id={`${id}-l`}>{label}</span>
        {hint && <span className="ds-three-field__hint fontsize-x-regular">{hint}</span>}
      </div>
      <div className="ds-three" role="radiogroup" aria-labelledby={`${id}-l`}>
        <span className="ds-three__thumb" />
        {opt('a')}{opt('n')}{opt('b')}
      </div>
    </div>
  );
}
