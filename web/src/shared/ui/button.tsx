import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

// ── Variants ─────────────────────────────────────────────────────
const buttonVariants = cva(
  'inline-flex items-center justify-center font-accent font-medium transition-all focus:outline-none focus:ring-2 focus:ring-rose focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-rose text-white hover:brightness-110',
        secondary:
          'bg-white text-black-base border border-grey-01 hover:bg-bg-panel',
        ghost:
          'text-beige-04 hover:text-black-base hover:bg-bg-panel',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-5 text-sm',
        lg: 'h-12 px-8 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

// ── Props ────────────────────────────────────────────────────────
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

// ── Component ────────────────────────────────────────────────────
export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}
