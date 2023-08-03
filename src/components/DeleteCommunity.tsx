"use client";

import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { Button, buttonVariants } from "./ui/Button";
import type { DeleteSubredditPayload } from "@/lib/validators/subreddit";

interface DeleteCommunityProps {
  communityId: string;
}

const DeleteCommunity: React.FC<DeleteCommunityProps> = ({ communityId }) => {
  const router = useRouter();
  
  const { mutate: deleteCommunity, isLoading: isDeletingCommunity } =
    useMutation({
      mutationFn: async () => {
        const payload: DeleteSubredditPayload = {
          id: communityId,
        };

        const { data } = await axios.post("/api/subreddit/delete", payload);

        return data as string;
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          // if subredit already exists
          if (error.response?.status === 404) {
            return toast({
              title: "Subreddit doesn't exists",
              description:
                "The subreddit that you want to delete doesn't exist.",
              variant: "destructive",
            });
          }
        }

        toast({
          title: "There was an error",
          description: "Could not delete subreddit.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        router.push(`/`);
      },
    });

  return (
    <Button
      className={buttonVariants({
        variant: "destructive",
        className: "w-full mb-4",
      })}
      onClick={() => deleteCommunity()}
      isLoading={isDeletingCommunity}
    >
      Delete community
    </Button>
  );
};

export default DeleteCommunity;
