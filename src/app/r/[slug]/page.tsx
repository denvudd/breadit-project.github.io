import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import React from "react";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { notFound } from "next/navigation";
import CreatePost from "@/components/post/CreatePost";
import PostFeed from "@/components/feed/PostFeed";
import { buttonVariants } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/Card";
import { MessageSquare, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import SubredditHints from "@/components/subreddit-hints/SubredditHints";

interface PageProps {
  params: {
    slug: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { slug } = params;
  const session = await getAuthSession();
  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      },
    },
  });

  if (!subreddit) return notFound();
  const isAuthor = subreddit.creatorId === session?.user.id;

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">
        r/{subreddit.name}
      </h1>
      <CreatePost session={session} />
      {/* Hints for new subreddit creator */}
      {true && <SubredditHints slug={slug} />}
      <PostFeed initPosts={subreddit.posts} subredditName={subreddit.name} />
    </>
  );
};

export default Page;
