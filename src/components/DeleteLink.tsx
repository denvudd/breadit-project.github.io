"use client";

import { Loader2, Trash2 } from "lucide-react";
import React from "react";
import { Button } from "./ui/Button";
import { SubredditDeleteLinkPayload } from "@/lib/validators/subreddit";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useLoginToast } from "@/hooks/use-login-toast";

interface DeleteLinkProps {
  linkId: string;
  subredditId: string;
}

const DeleteLink: React.FC<DeleteLinkProps> = ({ linkId, subredditId }) => {
  const router = useRouter();
  const { loginToast } = useLoginToast();
  const { mutate: deleteLink, isLoading: isLinkLoading } = useMutation({
    mutationFn: async ({ linkId, subredditId }: SubredditDeleteLinkPayload) => {
      const payload: SubredditDeleteLinkPayload = {
        linkId,
        subredditId,
      };
      const { data } = await axios.post(
        "/api/subreddit/info/links/delete",
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
        description: "Your link was not deleted, please try again leter.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();

      return toast({
        description: "Your link for subreddit has been deleted.",
      });
    },
  });

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-4 w-4 opacity-0 group-hover:opacity-100" // hover effect from accordion
      onClick={() => deleteLink({ subredditId, linkId })}
    >
      {isLinkLoading ? <Loader2 className="animate-spin" /> : <Trash2 />}
    </Button>
  );
};

export default DeleteLink;
