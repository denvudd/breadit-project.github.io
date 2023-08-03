"use client";

import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { Button, buttonVariants } from "./ui/Button";
import type { DeleteSubredditPayload } from "@/lib/validators/subreddit";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
interface DeleteCommunityProps {
  communityId: string;
}

const DeleteCommunity: React.FC<DeleteCommunityProps> = ({ communityId }) => {
  const [isOpen, setIsOpen] = React.useState(false);
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
        router.refresh();
      },
    });

  return (
    <Popover open={isOpen}>
      <PopoverTrigger asChild>
        <Button
          className={buttonVariants({
            variant: "destructive",
            className: "w-full mb-4",
          })}
          isLoading={isDeletingCommunity}
          onClick={() => setIsOpen(true)}
        >
          Delete community
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium">
            Are you sure that you want to delete this community?
          </h4>
          <div className="flex gap-2">
            <Button
              className={buttonVariants({
                variant: "destructive",
              })}
              onClick={() => {
                setIsOpen(false);
                deleteCommunity();
              }}
            >
              Delete
            </Button>
            <Button variant="subtle" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DeleteCommunity;
