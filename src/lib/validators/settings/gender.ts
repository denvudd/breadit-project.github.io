import { z } from "zod";

export const genders = ["MALE", "FEMALE", "NONBINARY", "NONE"] as const;

export const GenderValidator = z.object({
  gender: z.enum(genders),
});

export type GenderRequest = z.infer<typeof GenderValidator>;
