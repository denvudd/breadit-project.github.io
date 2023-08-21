import { formatTimeToNow } from "@/lib/utils";
import type { ExtendedPost } from "@/types/db";
import { MessageSquare } from "lucide-react";
import React from "react";
import EditorOutput from "../EditorOutput";
import PostVoteClient from "../post-vote/PostVoteClient";
import type { Vote } from "@prisma/client";
import SharePost from "../SharePost";
import Image from "next/image";

type PartialVote = Pick<Vote, "type">;

interface PostProps {
  subredditName: string;
  post: ExtendedPost;
  commentAmount: number;
  votesAmount: number;
  currentVote?: PartialVote;
}

const Post: React.FC<PostProps> = ({
  subredditName,
  post,
  commentAmount,
  votesAmount,
  currentVote,
}) => {
  const postRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="rounded-md bg-white dark:bg-slate-900 shadow">
      <div className="p-4 flex justify-between">
        <PostVoteClient
          postId={post.id}
          initVote={currentVote?.type}
          initVotesAmount={votesAmount}
          className="hidden sm:flex"
        />
        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500 dark:text-gray-300 truncate">
            {post.subreddit.avatar && (
              <a
                href={`/r/${subredditName}`}
                className="underline text-zinc-900 dark:text-zinc-100 text-sm underline-offset-2"
              >
                <Image
                  src={post.subreddit.avatar}
                  width={20}
                  height={20}
                  alt={`${subredditName} avatar`}
                  className="w-5 h-5 inline-block mr-2 rounded-full"
                />
              </a>
            )}
            {subredditName ? (
              <>
                <a
                  href={`/r/${subredditName}`}
                  className="underline text-zinc-900 dark:text-zinc-100 text-sm underline-offset-2"
                >
                  r/{subredditName}
                </a>
                <span className="px-1">•</span>
              </>
            ) : null}
            <span className="hidden sm:inline">
              Posted by u/{post.author.username}
            </span>{" "}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>

          <h2 className="py-2 leading-6 text-gray-900 dark:text-gray-100 inline-flex items-center gap-2 flex-wrap">
            <a
              className="text-lg font-semibold"
              href={`/r/${subredditName}/post/${post.id}`}
            >
              {post.title}
            </a>
            {post.flair && (
              <a
                href={`/r/${subredditName}?flair=${post.flair.name}`}
                className="rounded-[20px] text-zinc-100 cursor-pointer py-1 px-2 text-xs font-medium"
                style={{ backgroundColor: post.flair.color }}
              >
                {post.flair.name}
              </a>
            )}
          </h2>

          <div
            className="relative text-sm max-h-40 w-full overflow-clip"
            ref={postRef}
          >
            <EditorOutput content={post.content} />
            {postRef.current?.clientHeight === 160 ? (
              <a
                href={`/r/${subredditName}/post/${post.id}`}
                className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white dark:from-slate-900 to-transparent"
              ></a>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex gap-3 items-center bg-gray-50 dark:bg-gray-900 z-20 text-sm p-2 sm:p-4 sm:px-6 divide-x sm:divide-none">
        <PostVoteClient
          postId={post.id}
          initVote={currentVote?.type}
          initVotesAmount={votesAmount}
          className="w-fit flex flex-row gap-1 p-0 sm:hidden"
        />
        <a
          className="w-fit flex items-center gap-2 pl-3 sm:pl-0"
          href={`/r/${subredditName}/post/${post.id}#comments`}
        >
          <MessageSquare className="h-4 w-4" />
          {commentAmount} <span className="hidden sm:inline">Comments</span>
        </a>
        <SharePost subredditName={subredditName} subredditId={post.id} />
      </div>
    </div>
  );
};

export default Post;
