import { formatTimeToNow } from "@/lib/utils";
import type { ExtendedPost } from "@/types/db";
import { MessageSquare } from "lucide-react";
import React from "react";
import EditorOutput from "./EditorOutput";
import PostVoteClient from "./posts-vote/PostVoteClient";
import type { Vote } from "@prisma/client";

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
    <div className="rounded-md bg-white shadow">
      <div className="p-4 flex justify-between">
        <PostVoteClient
          postId={post.id}
          initVote={currentVote?.type}
          initVotesAmount={votesAmount}
        />
        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500">
            {subredditName ? (
              <>
                <a
                  href={`/r/${subredditName}`}
                  className="underline text-zinc-900 text-sm underline-offset-2"
                >
                  r/{subredditName}
                </a>
                <span className="px-1">•</span>
              </>
            ) : null}
            <span>Posted by u/{post.author.name}</span>{" "}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>

          <a href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
              {post.title}
            </h1>
          </a>

          <div
            className="relative text-sm max-h-40 w-full overflow-clip"
            ref={postRef}
          >
            <EditorOutput content={post.content} />
            {postRef.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent"></div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 z-20 text-sm p-4 sm:px-6">
        <a
          className="w-fit flex items-center gap-2"
          href={`/r/${subredditName}/post/${post.id}`}
        >
          <MessageSquare className="h-4 w-4" />
          {commentAmount}
        </a>
      </div>
    </div>
  );
};

export default Post;
