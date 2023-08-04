import { z } from "zod";

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpg",
  "image/png",
];

export const AvatarValidator = z.object({
  image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg and .png formats are supported."
    ),
});

export type AvatarRequest = z.infer<typeof AvatarValidator>;
