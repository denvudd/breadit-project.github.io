import ToFeedButton from "@/components/ToFeedButton";
import SubredditFlairs from "@/components/asides/SubredditFlairs";
import SubredditGeneral from "@/components/asides/SubredditGeneral";
import SubredditLinks from "@/components/asides/SubredditLinks";
import SubredditRules from "@/components/asides/SubredditRules";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
  shareModal: React.ReactNode;
  params: { slug: string };
}

const Layout = async ({ children, params, shareModal }: LayoutProps) => {
  const session = await getAuthSession();
  const { slug } = params;

  const subreddit = await db.subreddit.findFirst({
    where: { name: slug },
  });

  if (!subreddit) return notFound();
  const isAuthor = subreddit.creatorId === session?.user.id;

  return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-12">
      {shareModal}
      <div>
        <ToFeedButton />
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
            <div className="flex flex-col col-span-2 space-y-6">{children}</div>
            <div className="flex flex-col gap-3">
              {/* @ts-expect-error server component */}
              <SubredditGeneral
                subreddit={subreddit}
                slug={slug}
                session={session}
                isAuthor={isAuthor}
              />
              {/* @ts-expect-error server component */}
              <SubredditFlairs isAuthor={isAuthor} subredditId={subreddit.id} />
              {/* @ts-expect-error server component */}
              <SubredditRules
                subredditName={subreddit.name}
                subredditId={subreddit.id}
                isAuthor={isAuthor}
              />
              {/* @ts-expect-error server component */}
              <SubredditLinks isAuthor={isAuthor} subredditId={subreddit.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
