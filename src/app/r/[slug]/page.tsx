import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import React from "react";

interface PageProps {
  params: {
    slug: string;
  };
}

const page = async ({ params }) => {
  const { slug } = params;
  const session = await getAuthSession();
  const subreddit = await db.subreddit.findFirst({
    where: {name: slug},
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },
        // take: 
      }
    }
  })
  return <div>page</div>;
};

export default page;
