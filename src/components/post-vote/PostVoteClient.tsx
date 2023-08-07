"use client";

import { useLoginToast } from "@/hooks/use-login-toast";
import { usePrevious } from "@mantine/hooks";
import type { VoteType } from "@prisma/client";
import React from "react";
import { Button } from "../ui/Button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import type { PostVoteRequest } from "@/lib/validators/vote";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";

interface PostVoteClientProps {
  postId: string;
  initVotesAmount: number;
  initVote?: VoteType | null;
}

/**
 * We split the PostVotes into a client and a server component to allow for dynamic data
 * fetching inside of this component, allowing for faster page loads via suspense streaming.
 * We also have to option to fetch this info on a page-level and pass it in.
 *
 */

const PostVoteClient: React.FC<PostVoteClientProps> = ({
  postId,
  initVotesAmount,
  initVote,
}) => {
  const { loginToast } = useLoginToast();
  const [votesAmount, setVotesAmount] = React.useState<number>(initVotesAmount);
  const [currentVote, setCurrentVote] = React.useState(initVote);
  const prevVote = usePrevious(currentVote); // stores the previous value of a state in a ref

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVoteRequest = {
        postId,
        voteType,
      };

      await axios.patch("/api/subreddit/post/vote", payload);
    },
    onError: (error, voteType) => {
      if (voteType === "UP") setVotesAmount((prevAmount) => prevAmount - 1);
      else setVotesAmount((prevAmount) => prevAmount + 1);

      // reset current vote
      setCurrentVote(prevVote);

      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "Something went wrong",
        description: "Yout vote was not registered, please try again",
        variant: "destructive",
      });
    },
    onMutate: (voteType: VoteType) => {
      // if the user is canceling their vote
      if (currentVote === voteType) {
        setCurrentVote(undefined);

        if (voteType === "UP") setVotesAmount((prevAmount) => prevAmount - 1);
        else if (voteType === "DOWN")
          setVotesAmount((prevAmount) => prevAmount + 1);
      } else { // if the user create new vote
        setCurrentVote(voteType);

        if (voteType === "UP")
          setVotesAmount((prevAmount) => prevAmount + (currentVote ? 2 : 1));
        else if (voteType === "DOWN")
          setVotesAmount((prevAmount) => prevAmount - (currentVote ? 2 : 1));
      }
    },
  });

  React.useEffect(() => {
    setCurrentVote(initVote);
  }, [initVote]);

  return (
    <div className="flex flex-col gap-2 sm:gap-0 pr-4 sm:w-18 pb-4 sm:pb-0">
      <Button
        onClick={() => vote("UP")}
        size="sm"
        variant="ghost"
        aria-label="upvote"
      >
        <ArrowBigUp
          className={cn("h-5 w-5 text-zinc-700 dark:text-zinc-400", {
            "text-emerald-500 fill-emerald-500": currentVote === "UP",
          })}
        />
      </Button>
      <p className="text-center py-2 font-medium text-sm text-zinc-900 dark:text-zinc-100">
        {votesAmount}
      </p>
      <Button
        onClick={() => vote("DOWN")}
        size="sm"
        variant="ghost"
        aria-label="downvote"
      >
        <ArrowBigDown
          className={cn("h-5 w-5 text-zinc-700 dark:text-zinc-400", {
            "text-red-500 fill-red-500": currentVote === "DOWN",
          })}
        />
      </Button>
    </div>
  );
};

export default PostVoteClient;
