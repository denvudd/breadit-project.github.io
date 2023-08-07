import AddAbout from "@/components/AddAbout";
import DeleteCommunity from "@/components/DeleteCommunity";
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import ToFeedButton from "@/components/ToFeedButton";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { Users, Cake } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
  params: { slug: string };
}

const Layout = async ({ children, params }: LayoutProps) => {
  const session = await getAuthSession();
  const { slug } = params;
  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  if (!subreddit) return notFound();

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
  const isAuthor = subreddit.creatorId === session?.user.id;

  const memberCount = await db.subscription.count({
    where: {
      subreddit: {
        name: slug,
      },
    },
  });

  return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-12">
      <div>
        <ToFeedButton />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <div className="flex flex-col col-span-2 space-y-6">{children}</div>
          <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-300 dark:border-gray-600 order-first md:order-last">
            <div className="px-6 py-4 bg-zinc-100 dark:bg-gray-950">
              <p className="font-semibold py-3">About r/{subreddit.name}</p>
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
              {isAuthor && (
                <SubscribeLeaveToggle
                  subredditId={subreddit.id}
                  subredditName={subreddit.name}
                  isSubscribed={isSubscribed}
                />
              )}

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
        </div>
      </div>
    </div>
  );
};

export default Layout;
