import { z } from 'zod';

export const AnswersSchema = z.record(z.string(), z.string()); // { q1: '...', q2: '...' }
export type Answers = z.infer<typeof AnswersSchema>;

export const SubmitSchema = z.object({
  answers: AnswersSchema,
  persona: z.string().min(1),
  meta: z
    .object({
      ua: z.string().optional(),
      screen: z.string().optional(),
      sessionId: z.string().optional(),
    })
    .partial()
    .optional(),
});
export type SubmitPayload = z.infer<typeof SubmitSchema>;
