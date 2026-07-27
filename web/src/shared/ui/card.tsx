import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';
import type { ReactNode } from 'react';

// ── Variants ─────────────────────────────────────────────────────
const cardVariants = cva(
  'border border-grey-01 bg-white',
  {
    variants: {
      radius: {
        card: 'rounded-[30px]',
        sm: 'rounded-[16px]',
        pill: 'rounded-[999px]',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      shadow: {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
      },
    },
    defaultVariants: {
      radius: 'card',
      padding: 'md',
      shadow: 'sm',
    },
  },
);

// ── Props ────────────────────────────────────────────────────────
interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: ReactNode;
}

// ── Component ────────────────────────────────────────────────────
export function Card({ className, radius, padding, shadow, children, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ radius, padding, shadow, className }))} {...props}>
      {children}
    </div>
  );
}
