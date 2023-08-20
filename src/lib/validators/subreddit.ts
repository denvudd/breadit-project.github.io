import { z } from "zod";

export const SubredditValidator = z.object({
  name: z.string().min(3).max(21),
});

export const DeleteSubredditValidator = z.object({
  id: z.string(),
});

export const SubredditSubscriptionValidator = z.object({
  subredditId: z.string(),
});

export const SubredditAboutValidator = z.object({
  subredditId: z.string(),
  about: z.string().min(1).max(500),
});

export const SubredditRuleValidator = z.object({
  subredditId: z.string(),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export const SubredditDeleteRuleValidator = z.object({
  subredditId: z.string(),
  ruleId: z.string(),
});

export const SubredditLinkValidator = z.object({
  subredditId: z.string(),
  title: z.string().min(1).max(100),
  link: z.string().url(),
});

export const SubredditDeleteLinkValidator = z.object({
  subredditId: z.string(),
  linkId: z.string(),
});

export const SubredditAvatarValidator = z.object({
  subredditId: z.string(),
  avatar: z.any(),
  // .refine((val) => {
  //   if (!Array.isArray(val)) return false;
  //   if (val.some((file) => !(file instanceof File))) return false;
  //   return true;
  // }, "Must be an array of File")
  // .optional()
  // .nullable()
  // .default(null),
});

export const SubredditNameValidator = z.object({
  subredditId: z.string(),
  title: z.string().min(3).max(80),
});

export type CreateSubredditPayload = z.infer<typeof SubredditValidator>;
export type DeleteSubredditPayload = z.infer<typeof DeleteSubredditValidator>;

export type SubscribeToSubredditPayload = z.infer<
  typeof SubredditSubscriptionValidator
>;
export type SubredditAboutPayload = z.infer<typeof SubredditAboutValidator>;

export type SubredditRulePayload = z.infer<typeof SubredditRuleValidator>;
export type SubredditDeleteRulePayload = z.infer<
  typeof SubredditDeleteRuleValidator
>;

export type SubredditLinkPayload = z.infer<typeof SubredditLinkValidator>;
export type SubredditDeleteLinkPayload = z.infer<
  typeof SubredditDeleteLinkValidator
>;

export type SubredditAvatarPayload = z.infer<typeof SubredditAvatarValidator>;

export type SubredditNamePayload = z.infer<typeof SubredditNameValidator>;
