import * as React from 'react';
import { cx, mergeRefs, useControllable, useUid } from '../utils';
import { Icon } from './Icon';

export type FieldState = 'default' | 'selected' | 'error' | 'alert' | 'disabled' | 'hidden';

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue' | 'onChange'> {
  label: React.ReactNode;
  /** Ação ao lado do rótulo (ex.: "adicionar campo"). */
  labelAction?: { label: string; onClick: () => void };
  /** Texto de apoio abaixo do campo. */
  helper?: React.ReactNode;
  /** selected = positivo; error = negativo; alert = informação faltante; hidden = valor oculto com botão de mostrar. */
  state?: FieldState;
  leftIcon?: string;
  rightIcon?: string;
  /** Mostra o contador "n/máx". */
  counter?: number;
  /** icon = botão × à esquerda; text = botão "Limpar" à direita. */
  clearable?: 'icon' | 'text';
  /** Itens já adicionados (campo de múltiplos itens). Use com onAdd. */
  chips?: string[];
  onChipRemove?: (index: number) => void;
  onAdd?: () => void;
  /** Contador numérico com botões − e +. */
  stepper?: { onIncrement: () => void; onDecrement: () => void };
  /** Altura: desktop (32px) ou mobile (40px). Omitido, segue a largura da tela. */
  density?: 'desktop' | 'mobile';
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
}

const HELPER_ICON: Record<string, string> = { error: 'error', alert: 'warning' };

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    label, labelAction, helper, state = 'default', leftIcon, rightIcon, counter, clearable, chips, onChipRemove, onAdd, stepper,
    density, value, defaultValue = '', onChange, disabled, type, className, id, ...rest
  },
  ref,
) {
  const uid = useUid('tf');
  const fid = id ?? uid;
  const [val, setVal] = useControllable<string>(value, defaultValue);
  const [shown, setShown] = React.useState(false);
  const inner = React.useRef<HTMLInputElement>(null);
  const isDisabled = disabled || state === 'disabled';
  const hiddenMode = state === 'hidden';

  const btn = (name: string, aria: string, onClick: () => void, extra?: string) => (
    <button type="button" className={cx('ds-field__btn', extra)} aria-label={aria} onClick={onClick}>
      <Icon name={name} />
    </button>
  );

  let left: React.ReactNode = null;
  if (clearable === 'icon') left = btn('close', 'Limpar texto', () => { setVal(''); inner.current?.focus(); }, 'ds-field__btn--clear');
  else if (leftIcon) left = <Icon name={leftIcon} className="ds-field__icon" />;
  if (state === 'disabled' && !leftIcon && !clearable) left = null;

  return (
    <div
      className={cx(
        'ds-field', state !== 'default' && state !== 'hidden' && `ds-field--${state}`, state === 'hidden' && 'ds-field--hidden',
        density && `ds-${density}`, className,
      )}
    >
      <div className="ds-field__head">
        <label className="ds-field__label fontsize-x-regular" htmlFor={fid}>{label}</label>
        {labelAction && (
          <button type="button" className="ds-field__action fontsize-x-semi" onClick={labelAction.onClick}>{labelAction.label}</button>
        )}
      </div>
      <div className="ds-field__box">
        {left}
        {chips ? (
          <div className="ds-field__chips">
            {chips.map((c, i) => (
              <span className="ds-chip ds-chip--action fontsize-xs-regular" key={c + i}>
                {c}
                <button type="button" className="ds-chip__remove" aria-label={`Remover ${c}`} onClick={() => onChipRemove?.(i)}>
                  <Icon name="close" size="s" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <input
            ref={mergeRefs(ref, inner)} id={fid} className="ds-field__input fontsize-x-regular"
            type={hiddenMode ? (shown ? 'text' : 'password') : type ?? 'text'} value={val} disabled={isDisabled}
            aria-invalid={state === 'error' || undefined} aria-describedby={helper ? `${fid}-h` : undefined}
            onChange={(e) => { setVal(e.target.value); onChange?.(e.target.value, e); }} {...rest}
          />
        )}
        {counter != null && <span className="ds-field__counter fontsize-x-regular">{val.length}/{counter}</span>}
        {clearable === 'text' && val && (
          <button type="button" className="ds-field__clear fontsize-x-regular" onClick={() => { setVal(''); inner.current?.focus(); }}>
            Limpar<Icon name="close" />
          </button>
        )}
        {rightIcon && <Icon name={rightIcon} className={cx('ds-field__icon', rightIcon === 'expand_more' && 'ds-field__icon--muted')} />}
        {state === 'alert' && <Icon name="warning" className="ds-field__state" />}
        {state === 'disabled' && <Icon name="lock" className="ds-field__icon" />}
        {hiddenMode && btn(shown ? 'visibility_off' : 'visibility', shown ? 'Ocultar valor' : 'Mostrar valor', () => setShown(!shown))}
        {chips && onAdd && btn('add', 'Adicionar item', onAdd)}
        {stepper && (
          <span className="ds-field__stepper">
            {btn('remove', 'Diminuir', stepper.onDecrement)}
            {btn('add', 'Aumentar', stepper.onIncrement)}
          </span>
        )}
      </div>
      {helper && (
        <div className="ds-field__helper fontsize-xs-regular" id={`${fid}-h`}>
          <Icon name={HELPER_ICON[state] ?? 'info'} size="s" />
          <span>{helper}</span>
        </div>
      )}
    </div>
  );
});
