"use client";

import { Loader2, X } from "lucide-react";
import React from "react";
import { Button } from "./ui/Button";
import { SubredditDeleteFlairPayload } from "@/lib/validators/subreddit";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useLoginToast } from "@/hooks/use-login-toast";

interface DeleteFlairProps {
  flairId: string;
  subredditId: string;
}

const DeleteFlair: React.FC<DeleteFlairProps> = ({ flairId, subredditId }) => {
  const router = useRouter();
  const { loginToast } = useLoginToast();
  const { mutate: deleteFlair, isLoading: isFlairLoading } = useMutation({
    mutationFn: async ({
      flairId,
      subredditId,
    }: SubredditDeleteFlairPayload) => {
      const payload: SubredditDeleteFlairPayload = {
        flairId,
        subredditId,
      };
      const { data } = await axios.post(
        "/api/subreddit/info/flairs/delete",
        payload
      );
      return data as string;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        // if user are unauthorized
        if (error.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "Something went wrong",
        description: "Your flair was not deleted, please try again leter.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();

      return toast({
        description: "Your flair for subreddit has been deleted.",
      });
    },
  });

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-3 w-3" // hover effect from accordion
      onClick={() => deleteFlair({ subredditId, flairId })}
    >
      {isFlairLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <span className="rounded-full border p-1">
          <X className="h-3 w-3" />
        </span>
      )}
    </Button>
  );
};

export default DeleteFlair;
