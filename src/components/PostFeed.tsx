"use client";

import type { ExtendedPost } from "@/types/db";
import React from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import axios from "axios";
import { useSession } from "next-auth/react";
import Post from "./Post";

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
      const { data } = await axios.get("/api/post", {
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
      {posts.map((post, index) => {
        const votesAmount = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1;
          if (vote.type === "DOWN") return acc - 1;
          return acc;
        }, 0);

        // does user votes or not
        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id
        );

        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                commentAmount={post.comments.length}
                subredditName={post.subreddit.name}
                post={post}
              />
            </li>
          );
        } else {
          return (
            <li key={post.id}>
              <Post
                commentAmount={post.comments.length}
                subredditName={post.subreddit.name}
                post={post}
              />
            </li>
          );
        }
      })}
    </ul>
  );
};

export default PostFeed;
