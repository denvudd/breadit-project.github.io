"use client";

import React from "react";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import type { CommentRequest } from "@/lib/validators/comment";
import axios from "axios";

interface CreateCommentProps {}

const CreateComment: React.FC<CreateCommentProps> = ({}) => {
  const [input, setInput] = React.useState<string>("");
  const {} = useMutation({
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
      return data as string;
    },
  });

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="comment">Your comment</Label>
      <div className="mt">
        <Textarea
          id="comment"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          placeholder="What are your thoughts?"
        />
        <div className="mt-2 flex justify-end">
          <Button>Post</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
