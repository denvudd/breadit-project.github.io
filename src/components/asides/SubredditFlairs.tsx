import { db } from "@/lib/db";
import React from "react";

interface SubredditFlairsProps {
  isAuthor: boolean;
  subredditId: string;
}

const SubredditFlairs = async ({
  isAuthor,
  subredditId,
}: SubredditFlairsProps) => {
  const flairs = await db.flair.findMany({
    where: {
      subredditId,
    },
  });

  return (
    <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-300 dark:border-gray-600 order-first md:order-last">
      <p className="bg-white dark:bg-slate-900 px-6 py-4 border-b border-gray-300 dark:border-gray-600">
        Filter by flair
      </p>
      {isAuthor && (
        <div className="flex flex-col w-full px-6 py-4 bg-white dark:bg-slate-900">
          <p className="text-gray-500 dark:text-gray-300 text-sm w-full mb-2">
            Add flairs for cozy post filtering and visual perception on your
            subreddit.
          </p>
          {/* <AddLink subredditId={subredditId} /> */}
        </div>
      )}
      {!flairs.length && (
        <div className="divide-y divide-gray-100 dark:divide-gray-600 w-full px-6 pt-2 pb-4 bg-white dark:bg-slate-900 text-sm leading-6">
          <p>{"This subreddit doesn't have any flairs for filtering yet."}</p>
        </div>
      )}
      {!!flairs.length && (
        <div className="flex flex-col gap-2 w-full px-6 py-4 bg-white dark:bg-slate-900 text-sm leading-6">
          {flairs.map((flair) => (
            <div
              className="group w-full flex justify-between items-center mr-2"
              key={flair.id}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubredditFlairs;
