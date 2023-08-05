import { z } from "zod";

export const NameValidator = z.object({
  name: z.string().min(1).max(20),
});

export type NameRequest = z.infer<typeof NameValidator>;
