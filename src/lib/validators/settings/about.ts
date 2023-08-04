import { z } from "zod";

export const AboutValidator = z.object({
  about: z
    .string()
    .max(180)
});

export type AboutRequest = z.infer<typeof AboutValidator>;
