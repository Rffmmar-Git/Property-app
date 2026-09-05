import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";

interface FieldWrapperProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
}

function FieldWrapper({
  label,
  htmlFor,
  children,
}: FieldWrapperProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-[10px] font-medium text-slate-text sm:text-xs"
      >
        {label}
      </label>

      {children}
    </div>
  );
}

interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  id: string;
  label: string;
  icon?: ReactNode;
}

export function TextField({
  id,
  label,
  icon,
  className = "",
  ...inputProps
}: TextFieldProps) {
  return (
    <FieldWrapper label={label} htmlFor={id}>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-muted">
            {icon}
          </span>
        )}

        <input
          id={id}
          className={`h-9 w-full rounded border border-outline-variant bg-white text-[10px] text-slate-text outline-none transition placeholder:text-slate-muted focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10 ${
            icon ? "pl-8 pr-2.5" : "px-2.5"
          } ${className}`}
          {...inputProps}
        />
      </div>
    </FieldWrapper>
  );
}

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  id: string;
  label: string;
  options: SelectOption[];
}

export function SelectField({
  id,
  label,
  options,
  className = "",
  ...selectProps
}: SelectFieldProps) {
  return (
    <FieldWrapper label={label} htmlFor={id}>
      <select
        id={id}
        className={`h-9 w-full rounded border border-outline-variant bg-white px-2.5 text-[10px] text-slate-text outline-none transition focus:border-midnight-indigo focus:ring-2 focus:ring-midnight-indigo/10 ${className}`}
        {...selectProps}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}