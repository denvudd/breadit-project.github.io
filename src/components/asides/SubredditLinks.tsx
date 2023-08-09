import React from "react";
import AddLink from "../AddLink";
import { db } from "@/lib/db";

interface SubredditLinksProps {
  subredditId: string;
  isAuthor: boolean;
}

const SubredditLinks = async ({
  subredditId,
  isAuthor,
}: SubredditLinksProps) => {
  const links = await db.subredditLink.findMany({
    where: {
      subredditId,
    },
  });
  console.log(links);

  return (
    <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-300 dark:border-gray-600 order-first md:order-last">
      <p className="bg-white dark:bg-slate-900 px-6 py-4 border-b border-gray-300 dark:border-gray-600">
        Useful links
      </p>
      {isAuthor && (
        <div className="flex flex-col w-full px-6 py-4 bg-white dark:bg-slate-900">
          <p className="text-gray-500 dark:text-gray-300 text-sm w-full mb-2">
            Add links to this subreddit that might be helpful
          </p>
          <AddLink subredditId={subredditId} />
        </div>
      )}
      {!links.length && (
        <div className="divide-y divide-gray-100 dark:divide-gray-600 w-full px-6 pt-2 pb-4 bg-white dark:bg-slate-900 text-sm leading-6">
          <p>{"The author of this subreddit hasn't added useful links yet."}</p>
        </div>
      )}
      {!!links.length &&
        links.map((link, index) => (
          <a
            href={link.link}
            key={link.id}
            className="divide-y divide-gray-100 dark:divide-gray-600 block w-full px-6 py-2 bg-white dark:bg-slate-900 text-sm leading-6 
            underline-offset-4 hover:underline hover:text-sky-600"
          >
            {index + 1}. {link.title}
          </a>
        ))}
    </div>
  );
};

export default SubredditLinks;
