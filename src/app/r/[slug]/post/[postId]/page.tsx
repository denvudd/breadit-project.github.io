import CommentSection from "@/components/comments/CommentSection";
import EditorOutput from "@/components/EditorOutput";
import PostVoteServer from "@/components/post-vote/PostVoteServer";
import PostVoteShell from "@/components/post-vote/PostVoteShell";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { formatTimeToNow } from "@/lib/utils";
import type { CachedPost } from "@/types/redis";
import type { Post, Subreddit, User, Vote, Comment } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";

interface PageProps {
  params: {
    postId: string;
  };
}

// hard reload with no caching using next js 13
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const page = async ({ params }: PageProps) => {
  // read from redis cache
  const cachedPost = (await redis.hgetall(
    `post: ${params.postId}`
  )) as CachedPost;

  let post:
    | (Post & {
        votes: Vote[];
        author: User;
        subreddit: Subreddit;
        comments: Comment[];
      })
    | null = null;

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        votes: true,
        author: true,
        subreddit: true,
        comments: true,
      },
    });
  }

  if (!post && !cachedPost) return notFound();

  return (
    <div className="rounded-md bg-white dark:bg-slate-900 shadow p-4">
      <div className="flex justify-between">
        <React.Suspense fallback={<PostVoteShell />}>
          {/* @ts-expect-error server component */}
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            className="hidden sm:flex"
            getData={async () => {
              return await db.post.findUnique({
                where: {
                  id: params.postId,
                },
                include: {
                  votes: true,
                },
              });
            }}
          />
        </React.Suspense>
        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500 dark:text-gray-300">
            {post?.subreddit.name && (
              <>
                <a
                  href={`/r/${post.subreddit.name}`}
                  className="underline text-zinc-900 dark:text-zinc-100 text-sm underline-offset-2"
                >
                  r/{post.subreddit.name}
                </a>
                <span className="px-1">•</span>
              </>
            )}
            {cachedPost.subreddit?.name && (
              <>
                <a
                  href={`/r/${cachedPost.subreddit.name}`}
                  className="underline text-zinc-900 dark:text-zinc-100 text-sm underline-offset-2"
                >
                  r/{cachedPost.subreddit.name}
                </a>
                <span className="px-1">•</span>
              </>
            )}
            <span>
              Posted by u/{post?.author.username ?? cachedPost.authorUsername}
            </span>{" "}
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
          </div>

          <h1 className="text-xl font-semibold py-2 leading-6 text-gray-900 dark:text-gray-100">
            {post?.title ?? cachedPost.title}
          </h1>

          <div>
            <EditorOutput content={post?.content ?? cachedPost.content} />
          </div>
          <div className="flex w-full justify-end gap-3 pt-2">
            {/* @ts-expect-error server component */}
            <PostVoteServer
              postId={post?.id ?? cachedPost.id}
              className="w-fit flex flex-row gap-1 p-0 sm:hidden"
              getData={async () => {
                return await db.post.findUnique({
                  where: {
                    id: params.postId,
                  },
                  include: {
                    votes: true,
                  },
                });
              }}
            />
          </div>
        </div>
      </div>
      <React.Suspense
        fallback={<Loader2 className="h-5 w-5 animate-spin text-zinc-500" />}
      >
        {/* @ts-expect-error server component */}
        <CommentSection postId={post?.id ?? cachedPost.id} />
      </React.Suspense>
    </div>
  );
};

export default page;
