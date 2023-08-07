"use client";

import React from "react";
import UserAvatar from "../UserAvatar";
import type { Comment, CommentVote, User } from "@prisma/client";
import { formatTimeToNow } from "@/lib/utils";
import CommentVotes from "./CommentVotes";
import { Button } from "../ui/Button";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Label } from "../ui/Label";
import { Textarea } from "../ui/Textarea";
import { useMutation } from "@tanstack/react-query";
import type { CommentRequest } from "@/lib/validators/comment";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
};

interface PostCommentProps {
  comment: ExtendedComment;
  votesAmount: number;
  currentVote: CommentVote | undefined;
  postId: string;
}

const PostComment: React.FC<PostCommentProps> = ({
  comment,
  votesAmount,
  currentVote,
  postId,
}) => {
  const commentRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data: session } = useSession();
  const [isReplying, setIsReplying] = React.useState<boolean>(false);
  const [input, setInput] = React.useState<string>("");

  const { mutate: createComment, isLoading: isCommentLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      };

      const { data } = await axios.patch(
        `/api/subreddit/post/comment`,
        payload
      );
      return data;
    },
    onError: () => {
      return toast({
        title: "Something went wrong",
        description: "Comment wasn't posted successfully, please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      setIsReplying(false);
      setInput("");
    },
  });

  useOnClickOutside(commentRef, () => {
    setIsReplying(false)
  })

  return (
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className="h-6 w-6"
        />
        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            u/{comment.author.username}
          </p>
          <p className="max-h-40 truncate text-xs text-zinc-900 dark:text-zinc-100">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>
      <p className="text-sm text-zinc-900 dark:text-zinc-100 mt-2">{comment.text}</p>
      <div className="flex gap-2 items-center flex-wrap">
        <CommentVotes
          commentId={comment.id}
          initVotesAmount={votesAmount}
          initVote={currentVote}
        />
        <Button
          onClick={() => {
            if (!session) return router.push("/sign-in");
            setIsReplying(true);
          }}
          variant={"ghost"}
          size="xs"
        >
          <MessageSquare className="h-4 w-4 mr-1.5" />
          Reply
        </Button>
        {isReplying ? (
          <div className="grid w-full gap-2">
            <Label htmlFor="comment">Your comment</Label>
            <div className="mt">
              <Textarea
                id="comment"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
                placeholder="What are your thoughts?"
              />
              <div className="mt-2 flex justify-end gap-2">
                <Button
                  tabIndex={-1}
                  variant="subtle"
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </Button>
                <Button
                  isLoading={isCommentLoading}
                  disabled={input.length === 0}
                  onClick={() => {
                    if (!input) return;
                    createComment({
                      postId,
                      text: input,
                      replyToId: comment.replyToId ?? comment.id,
                    });
                  }}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PostComment;
