import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
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

  return <div>
    <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between"></div>
  </div>;
};

export default page;
