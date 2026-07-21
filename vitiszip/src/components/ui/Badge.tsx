import { cn } from '@/lib/utils';

type Variant = 'primary' | 'success' | 'warning' | 'danger' | 'gray' | 'purple' | 'orange';

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger:  'bg-red-100 text-red-700',
  gray:    'bg-gray-100 text-gray-700',
  purple:  'bg-purple-100 text-purple-700',
  orange:  'bg-orange-100 text-orange-700',
};

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
};

export default function Badge({ children, variant = 'gray', size = 'sm', className, dot }: Props) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-semibold rounded-full',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      VARIANT_CLASSES[variant],
      className
    )}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full', {
        'bg-primary-500': variant === 'primary',
        'bg-green-500': variant === 'success',
        'bg-yellow-500': variant === 'warning',
        'bg-red-500': variant === 'danger',
        'bg-gray-400': variant === 'gray',
      })} />}
      {children}
    </span>
  );
}
