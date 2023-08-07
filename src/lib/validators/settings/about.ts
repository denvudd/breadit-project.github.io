import { z } from "zod";

export const AboutValidator = z.object({
  about: z
    .string()
    .min(1)
    .max(300)
});

export type AboutRequest = z.infer<typeof AboutValidator>;
