'use client';

import { cn } from 'cn';
import { useId } from 'react';
import type { ReactNode } from 'react';
import type { Except } from 'type-fest';
import { Label } from '@/components/ui/label';
import type { InputState } from './types';

type FieldContainerProps = {
  label?: string;
  labelClassName?: string;
  state?: InputState;
  /** Always visible, unless an error replaces it. */
  description?: string;
  /** Replaces the description when present. */
  errorMessage?: string;
  className?: string;
  /**
   * Receives the ids to wire onto the control. Using a render prop rather than
   * cloning children keeps the association explicit and survives fragments.
   */
  children: (ids: { controlId: string; describedBy: string | undefined }) => ReactNode;
};

/** Props a `*Field` component forwards to its container. */
export type FieldWrapperProps = Except<FieldContainerProps, 'state' | 'errorMessage' | 'children'>;

/**
 * Label / control / message chrome shared by every field.
 *
 * The message slot is single-purpose: an error message replaces the
 * description rather than stacking below it, so the field never grows or
 * shifts layout when validation fails.
 */
export function FieldContainer({
  label,
  labelClassName,
  state = 'idle',
  description,
  errorMessage,
  className,
  children,
}: FieldContainerProps) {
  const controlId = useId();
  const messageId = `${controlId}-message`;

  const message = errorMessage ?? description;
  const hasError = state === 'error' || Boolean(errorMessage);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <Label className={cn('text-body-2', labelClassName)} htmlFor={controlId}>
          {label}
        </Label>
      )}

      {children({ controlId, describedBy: message ? messageId : undefined })}

      {message && (
        <p
          className={cn('text-caption', hasError ? 'text-destructive' : 'text-muted-foreground')}
          id={messageId}
          role={errorMessage ? 'alert' : undefined}
        >
          {message}
        </p>
      )}
    </div>
  );
}
