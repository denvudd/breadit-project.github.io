import ToFeedButton from "@/components/ToFeedButton";
import SubredditGeneral from "@/components/asides/SubredditGeneral";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
  params: { slug: string };
}

const Layout = async ({ children, params }: LayoutProps) => {
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

  return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-12">
      <div>
        <ToFeedButton />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <div className="flex flex-col col-span-2 space-y-6">{children}</div>
        </div>
        <div className="flex flex-col gap-2">
          {/* @ts-expect-error server component */}
          <SubredditGeneral subreddit={subreddit} slug={slug} />
        </div>
      </div>
    </div>
  );
};

export default Layout;
