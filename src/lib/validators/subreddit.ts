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

export type CreateSubredditPayload = z.infer<typeof SubredditValidator>;
export type DeleteSubredditPayload = z.infer<typeof DeleteSubredditValidator>;
export type SubscribeToSubredditPayload = z.infer<
  typeof SubredditSubscriptionValidator
>;
