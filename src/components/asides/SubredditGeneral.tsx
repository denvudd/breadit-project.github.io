import { db } from "@/lib/db";
import type { Subreddit } from "@prisma/client";
import { format } from "date-fns";
import { Cake, Users, Share } from "lucide-react";
import Link from "next/link";
import React from "react";
import AddAbout from "../AddAbout";
import DeleteCommunity from "../DeleteCommunity";
import SubscribeLeaveToggle from "../SubscribeLeaveToggle";
import { buttonVariants } from "../ui/Button";
import { Session } from "next-auth";

interface SubredditGeneralProps {
  slug: string;
  subreddit: Subreddit;
  session: Session | null;
  isAuthor: boolean;
}

const SubredditGeneral = async ({
  slug,
  subreddit,
  session,
  isAuthor,
}: SubredditGeneralProps) => {
  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subreddit: {
            name: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      });

  const isSubscribed = !!subscription;

  const memberCount = await db.subscription.count({
    where: {
      subreddit: {
        name: slug,
      },
    },
  });

  return (
    <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-300 dark:border-gray-600 order-first md:order-last">
      <div className="px-6 py-4 bg-zinc-100 dark:bg-gray-950 flex items-center justify-between">
        <p className="font-semibold py-3">About r/{subreddit.name}</p>
        <Link href={`/r/${slug}/share`}>
          <Share className="h-4 w-4" />
        </Link>
      </div>
      {isAuthor && (
        <div className="flex w-full px-6 pt-4 bg-white dark:bg-slate-900">
          <AddAbout subredditId={subreddit.id} about={subreddit.about} />
        </div>
      )}

      {subreddit.about && (
        <dl className="flex flex-col gap-2 w-full px-6 pt-4 bg-white dark:bg-slate-900 text-sm leading-6">
          <dt className="text-gray-500 dark:text-gray-300">About</dt>
          <dd>{subreddit.about}</dd>
        </dl>
      )}

      <dl className="divide-y divide-gray-100 dark:divide-gray-600 px-6 py-4 text-sm leading-6 bg-white dark:bg-slate-900">
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500 dark:text-gray-300">Created</dt>
          <dd className="text-gray-700 dark:text-gray-200">
            <time
              dateTime={subreddit.createdAt.toDateString()}
              className="flex items-center gap-1"
            >
              <Cake className="w-4 h-4" />
              {format(subreddit.createdAt, "MMMM d, yyyy")}
            </time>
          </dd>
        </div>

        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500 dark:text-gray-300">Members</dt>
          <dd className="text-gray-700 dark:text-gray-500">
            <div className="text-gray-900 dark:text-gray-200 flex items-center gap-1">
              <Users className="w-4 h-4" /> {memberCount}
            </div>
          </dd>
        </div>

        {isAuthor && (
          <div className="flex justify-between gap-x-4 py-3">
            <p className="text-gray-500 dark:text-gray-200">
              You created this community
            </p>
          </div>
        )}

        <SubscribeLeaveToggle
          subredditId={subreddit.id}
          subredditName={subreddit.name}
          isSubscribed={isSubscribed}
        />

        <Link
          className={buttonVariants({
            variant: "outline",
            className: "w-full mb-4",
          })}
          href={`r/${slug}/submit`}
        >
          Create Post
        </Link>

        {isAuthor && <DeleteCommunity communityId={subreddit.id} />}
      </dl>
    </div>
  );
};

export default SubredditGeneral;
