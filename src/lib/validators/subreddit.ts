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
  description: z.string().optional(),
});

export type CreateSubredditPayload = z.infer<typeof SubredditValidator>;
export type DeleteSubredditPayload = z.infer<typeof DeleteSubredditValidator>;
export type SubscribeToSubredditPayload = z.infer<
  typeof SubredditSubscriptionValidator
>;
export type SubredditAboutPayload = z.infer<typeof SubredditAboutValidator>;
export type SubredditRulePayload = z.infer<typeof SubredditRuleValidator>;
