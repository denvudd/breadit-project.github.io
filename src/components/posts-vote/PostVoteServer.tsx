import { getAuthSession } from "@/lib/auth";
import type { Post, Vote, VoteType } from "@prisma/client";
import { notFound } from "next/navigation";
import React from "react";
import PostVoteClient from "./PostVoteClient";

interface PostVoteServerProps {
  postId: string;
  initVotesAmount: number;
  initVote?: VoteType | null;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
}

/**
 * We split the PostVotes into a client and a server component to allow for dynamic data
 * fetching inside of this component, allowing for faster page loads via suspense streaming.
 * We also have to option to fetch this info on a page-level and pass it in.
 *
 */

const PostVoteServer = async ({
  postId,
  initVotesAmount,
  initVote,
  getData,
}: PostVoteServerProps) => {
  const session = await getAuthSession();
  let _votesAmount: number = 0;
  let _currentVote: VoteType | null | undefined = undefined;

  if (getData) {
    const post = await getData();

    if (!post) return notFound();

    _votesAmount = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;

      return acc;
    }, 0);

    _currentVote = post.votes.find(
      (vote) => vote.userId === session?.user.id
    )?.type;
  } else {
    _votesAmount = initVotesAmount;
    _currentVote = initVote;
  }

  return (
    <PostVoteClient
      postId={postId}
      initVotesAmount={_votesAmount}
      initVote={_currentVote}
    />
  );
};

export default PostVoteServer;
