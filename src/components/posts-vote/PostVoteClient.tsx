"use client";

import { useLoginToast } from "@/hooks/use-login-toast";
import { usePrevious } from "@mantine/hooks";
import type { VoteType } from "@prisma/client";
import React from "react";
import { Button } from "../ui/Button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostVoteClientProps {
  postId: string;
  initVotesAmount: number;
  initVote?: VoteType | null;
}

const PostVoteClient: React.FC<PostVoteClientProps> = ({
  postId,
  initVotesAmount,
  initVote,
}) => {
  const { loginToast } = useLoginToast();
  const [votesAmount, setVotesAmount] = React.useState<number>(initVotesAmount);
  const [currentVote, setCurrentVote] = React.useState(initVote);
  const prevVote = usePrevious(currentVote); // stores the previous value of a state in a ref

  React.useEffect(() => {
    setCurrentVote(initVote);
  }, [initVote]);

  return (
    <div className="flex flex-col gap-2 sm:gap-0 pr-4 sm:w-18 pb-4 sm:pb-0">
      <Button size="sm" variant="ghost" aria-label="upvote">
        <ArrowBigUp
          className={cn("h-5 w-5 text-zinc-700", {
            "text-emerald-500 fill-emerald-500": currentVote === "UP",
          })}
        />
      </Button>
      <p className="text-center py-2 font-medium text-sm text-zinc-900">
        {votesAmount}
      </p>
      <Button size="sm" variant="ghost" aria-label="downvote">
        <ArrowBigDown
          className={cn("h-5 w-5 text-zinc-700", {
            "text-red-500 fill-red-500": currentVote === "UP",
          })}
        />
      </Button>
    </div>
  );
};

export default PostVoteClient;
