"use client";

import type { ExtendedPost } from "@/types/db";
import React from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import axios from "axios";
import { useSession } from "next-auth/react";

interface PostFeedProps {
  initPosts: ExtendedPost[];
  subredditName?: string;
}

const PostFeed: React.FC<PostFeedProps> = ({ initPosts, subredditName }) => {
  const lastPostRef = React.useRef<HTMLElement>(null);
  const { data: session } = useSession();
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const { data } = await axios.get("/api/posts", {
        params: {
          limit: INFINITE_SCROLLING_PAGINATION_RESULTS,
          page: pageParam,
          subredditName: !!subredditName ? subredditName : null,
        },
      });

      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: { pages: [initPosts], pageParams: [1] },
    }
  );

  // .flatMap() because posts can be type ExtendedPost[] | ExtendedPost[][]
  const posts = data?.pages.flatMap((page) => page) ?? initPosts;

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      
    </ul>
  );
};

export default PostFeed;
