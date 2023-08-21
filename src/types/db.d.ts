import { Post, Subreddit, User, Vote, Comment, Flair } from "@prisma/client";

export type ExtendedPost = Post & {
  subreddit: Subreddit;
  votes: Vote[];
  author: User;
  comments: Comment[];
  flair?: Flair | null;
};
