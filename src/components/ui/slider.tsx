import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '../../lib/utils';

export interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /** Accessible label applied directly to the slider thumb (`role="slider"`). */
  thumbLabel?: string;
  /** Accessible `aria-labelledby` applied directly to the slider thumb (`role="slider"`). */
  thumbLabelledBy?: string;
  /** Human-readable value text for screen readers (e.g. "65%"). */
  valueText?: string;
}

/**
 * Accessible Radix UI Slider wrapper forwarding accessible names and `aria-valuetext`
 * directly to the interactive slider thumb.
 */
export const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, thumbLabel, thumbLabelledBy, valueText, ...props }, ref) => (
    <SliderPrimitive.Root
      ref={ref}
      className={cn('relative flex w-full touch-none select-none items-center py-1', className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-200">
        <SliderPrimitive.Range className="absolute h-full bg-emerald-600" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        aria-label={thumbLabel}
        aria-labelledby={thumbLabelledBy}
        aria-valuetext={valueText}
        className="block h-5 w-5 rounded-full border-2 border-emerald-600 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-xs cursor-pointer"
      />
    </SliderPrimitive.Root>
  )
);
Slider.displayName = SliderPrimitive.Root.displayName;
