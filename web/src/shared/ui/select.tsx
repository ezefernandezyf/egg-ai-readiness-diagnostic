import { cn } from './utils';

// ── Props ────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  options: Array<{ value: string; label: string }>;
}

// ── Component ────────────────────────────────────────────────────
export function Select({
  className,
  error,
  errorMessage,
  label,
  options,
  id,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-black-base">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'flex h-10 w-full rounded-lg border bg-bg-panel px-3 py-2 text-sm text-black-base placeholder:text-beige-04 focus:outline-none focus:ring-2 focus:ring-rose focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
          error ? 'border-red-500 focus:ring-red-400' : 'border-grey-01',
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
