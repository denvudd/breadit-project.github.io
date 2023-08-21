import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import React from "react";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { notFound } from "next/navigation";
import CreatePost from "@/components/post/CreatePost";
import PostFeed from "@/components/feed/PostFeed";
import SubredditHints from "@/components/subreddit-hints/SubredditHints";
import SubredditAvatar from "@/components/SubredditAvatar";
import EditSubredditTitle from "@/components/EditSubredditTitle";
interface PageProps {
  params: {
    slug: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { slug } = params;
  const { flair } = searchParams;
  console.log(flair);
  

  const session = await getAuthSession();
  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        where: {
          flair: {
            name: typeof flair === "string" ? flair : undefined,
          },
        },
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
          flair: true,
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
      <div className="flex items-center gap-4">
        <div className="w-16 h-16">
          <SubredditAvatar
            avatar={subreddit.avatar}
            subredditName={subreddit.name}
            subredditId={subreddit.id}
            isAuthor={isAuthor}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl md:text-4xl h-8">
            {isAuthor ? (
              <EditSubredditTitle
                subredditId={subreddit.id}
                subredditTitle={subreddit.title ?? subreddit.name}
              />
            ) : (
              <h1 className="font-bold text-3xl md:text-4xl h-8">
                {subreddit.title ?? subreddit.name}
              </h1>
            )}
          </h1>
          <p className="font-medium text-gray-500">r/{subreddit.name}</p>
        </div>
      </div>
      <CreatePost session={session} />
      {/* Hints for new subreddit creator */}
      {subreddit.creatorId === session?.user.id && (
        <SubredditHints slug={slug} />
      )}
      <PostFeed
        initPosts={subreddit.posts}
        subredditName={subreddit.name}
        searchParams={{
          flair: typeof flair === "string" ? flair : null,
        }}
      />
    </>
  );
};

export default Page;
