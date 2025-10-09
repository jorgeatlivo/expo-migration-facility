import { z } from 'zod';

export const createCancellationFormSchema = (t: (key: string) => string) =>
  z.object({
    recurrentShifts: z.array(z.string()).default([]),
    cancelReason: z.string().min(1, t('cancellation_reason_required')),
    reasonDetails: z.string().default(''),
  });

export type CancellationFormData = z.infer<
  ReturnType<typeof createCancellationFormSchema>
>;
