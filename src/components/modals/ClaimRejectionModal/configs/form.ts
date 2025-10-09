import { z } from 'zod';

export const createClaimRejectionFormSchema = (t: (key: string) => string) =>
  z.object({
    rejectionReason: z.string().min(1, t('rejection_reason_required')),
    reasonDetail: z.string().default(''),
  });

export type ClaimRejectionFormData = z.infer<
  ReturnType<typeof createClaimRejectionFormSchema>
>;
