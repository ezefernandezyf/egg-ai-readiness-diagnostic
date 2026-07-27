import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

// ── Variants ─────────────────────────────────────────────────────
const inputVariants = cva(
  'flex h-10 w-full rounded-lg border bg-bg-panel px-3 py-2 text-sm text-black-base placeholder:text-beige-04 focus:outline-none focus:ring-2 focus:ring-rose focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      error: {
        true: 'border-red-500 focus:ring-red-400',
        false: 'border-grey-01',
      },
    },
    defaultVariants: {
      error: false,
    },
  },
);

// ── Props ────────────────────────────────────────────────────────
interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  errorMessage?: string;
}

// ── Component ────────────────────────────────────────────────────
export function Input({
  className,
  error,
  errorMessage,
  label,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-black-base">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(inputVariants({ error, className }))}
        {...props}
      />
      {error && errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
