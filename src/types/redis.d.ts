import type { Vote } from "@prisma/client";

export type CachedPost = {
  id: string;
  title: string;
  authorUsername: string;
  content: string;
  currentVote: Vote["type"] | null;
  createdAt: Date;
  commentsCount: number;
  flair: {
    name: string;
    color: string;
  } | null;
  subreddit: {
    name: string;
  };
};
