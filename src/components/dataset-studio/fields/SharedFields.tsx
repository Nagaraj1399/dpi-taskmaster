import React from 'react';
import { Slider } from '../../ui/slider';
import { INPUT_CONTROL_CLASS, SUBTLE_PANEL_CLASS } from '../../ui/styles';

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  type?: 'text' | 'password' | 'url';
  mono?: boolean;
  rightAdornment?: React.ReactNode;
}

/** Accessible labeled text input field for dataset editing. */
export const TextField: React.FC<TextFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  helperText,
  type = 'text',
  mono = false,
  rightAdornment,
}) => (
  <div className={`${SUBTLE_PANEL_CLASS} p-4 space-y-1.5`}>
    <label htmlFor={id} className="block text-xs font-bold text-slate-800">
      {label}
    </label>
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${INPUT_CONTROL_CLASS} ${mono ? 'font-mono' : ''} ${
          rightAdornment ? 'pr-9' : ''
        }`}
      />
      {rightAdornment}
    </div>
    {helperText && <p className="text-[11px] text-slate-600">{helperText}</p>}
  </div>
);

interface NumberFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  helperText?: string;
  badgeText?: string;
  badgeClassName?: string;
}

/** Accessible labeled numeric input field preserving `0` as a valid value. */
export const NumberField: React.FC<NumberFieldProps> = ({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  helperText,
  badgeText,
  badgeClassName = 'text-slate-700',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = Number(e.target.value);
    onChange(Number.isFinite(parsed) ? parsed : 0);
  };

  return (
    <div className={`${SUBTLE_PANEL_CLASS} p-4 space-y-1.5`}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-bold text-slate-800">
          {label}
        </label>
        {badgeText && (
          <span className={`text-xs font-mono font-bold ${badgeClassName}`}>{badgeText}</span>
        )}
      </div>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className={`${INPUT_CONTROL_CLASS} font-mono`}
      />
      {helperText && <p className="text-[11px] text-slate-600">{helperText}</p>}
    </div>
  );
};

interface SliderFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  valueDisplay: string;
  valueClassName?: string;
  helperText?: string;
  footerContent?: React.ReactNode;
  className?: string;
}

/** Accessible Radix UI Slider field with visible label, value badge, and `aria-valuetext`. */
export const SliderField: React.FC<SliderFieldProps> = ({
  id,
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  valueDisplay,
  valueClassName = 'text-emerald-700',
  helperText,
  footerContent,
  className = '',
}) => (
  <div className={`${SUBTLE_PANEL_CLASS} p-4 space-y-2 ${className}`}>
    <div className="flex items-center justify-between text-xs">
      <span id={id} className="font-bold text-slate-800">
        {label}
      </span>
      <span className={`font-mono font-bold ${valueClassName}`}>{valueDisplay}</span>
    </div>
    <Slider
      min={min}
      max={max}
      step={step}
      value={[value]}
      onValueChange={(vals) => {
        const nextVal = vals[0];
        if (nextVal !== undefined) {
          onChange(nextVal);
        }
      }}
      thumbLabelledBy={id}
      valueText={valueDisplay}
    />
    {footerContent}
    {helperText && <p className="text-[11px] text-slate-600">{helperText}</p>}
  </div>
);

interface SelectFieldOption<T extends string> {
  value: T;
  label: string;
}

interface SelectFieldProps<T extends string> {
  id: string;
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly SelectFieldOption<T>[];
  helperText?: string;
}

/** Accessible labeled select field with strongly typed option values. */
export function SelectField<T extends string>({
  id,
  label,
  value,
  onChange,
  options,
  helperText,
}: SelectFieldProps<T>): React.ReactElement {
  return (
    <div className={`${SUBTLE_PANEL_CLASS} p-4 space-y-1.5`}>
      <label htmlFor={id} className="block text-xs font-bold text-slate-800">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={INPUT_CONTROL_CLASS}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {helperText && <p className="text-[11px] text-slate-600">{helperText}</p>}
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  subtext?: string;
  valueClassName?: string;
}

/** Compact summary metric card used inside dataset headers and panels. */
export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  valueClassName = 'text-slate-900',
}) => (
  <div className={`${SUBTLE_PANEL_CLASS} p-3`}>
    <div className="text-[11px] text-slate-600 font-semibold">{label}</div>
    <div className={`text-base font-extrabold font-mono mt-0.5 ${valueClassName}`}>{value}</div>
    {subtext && <div className="text-[11px] text-slate-500 mt-0.5">{subtext}</div>}
  </div>
);
