import EditorOutput from "@/components/EditorOutput";
import PostVoteServer from "@/components/posts-vote/PostVoteServer";
import PostVoteShell from "@/components/posts-vote/PostVoteShell";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { formatTimeToNow } from "@/lib/utils";
import type { CachedPost } from "@/types/redis";
import type { Post, User, Vote } from "@prisma/client";
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

  let post: (Post & { votes: Vote[]; author: User }) | null = null;

  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        votes: true,
        author: true,
      },
    });
  }

  if (!post && !cachedPost) return notFound();

  return (
    <div>
      <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
        <React.Suspense fallback={<PostVoteShell />}>
          {/* @ts-expect-error server component */}
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
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

        <div className="sm:w-0 w-full flex-1 bg-white p-4 founded-sm">
          <p className="max-h-40 mt-1 truncate text-xs text-gray-500">
            Posted by u/{post?.author.username ?? cachedPost.authorUsername}
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
          </p>
          <h1 className="text-xl font-semibold py-2 leading-6 text-gray-900">
            {post?.title ?? cachedPost.title}
          </h1>
          <EditorOutput content={post?.content ?? cachedPost.content} />
        </div>
      </div>
    </div>
  );
};

export default page;
