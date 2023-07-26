"use client";

import React from "react";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import type { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import axios, { AxiosError } from "axios";
import { useLoginToast } from "@/hooks/use-login-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface SubscribeLeaveToggleProps {
  subredditId: string;
  isSubscribed: boolean;
  subredditName: string;
}

const SubscribeLeaveToggle: React.FC<SubscribeLeaveToggleProps> = ({
  subredditId,
  isSubscribed,
  subredditName,
}) => {
  const { loginToast } = useLoginToast();
  const router = useRouter();

  const { mutate: subscribe, isLoading: isSubscriptionLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data } = await axios.post("/api/subreddit/subscribe", payload);
      return data as string;
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        return loginToast();
      }

      return toast({
        title: "There was a problem",
        description: "Something went wrong, please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      React.startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Subscribed",
        description: `You are now subscribed to r/${subredditName}`,
      });
    },
  });

  const { mutate: unsubscribe, isLoading: isUnsubscriptionLoading } =
    useMutation({
      mutationFn: async () => {
        const payload: SubscribeToSubredditPayload = {
          subredditId,
        };

        const { data } = await axios.post(
          "/api/subreddit/unsubscribe",
          payload
        );
        return data as string;
      },
      onError: (error) => {
        if (error instanceof AxiosError && error.response?.status === 401) {
          return loginToast();
        }

        return toast({
          title: "There was a problem",
          description: "Something went wrong, please try again.",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        React.startTransition(() => {
          router.refresh();
        });

        return toast({
          title: "Unsubscribed",
          description: `You are now unsubscribed from r/${subredditName}`,
        });
      },
    });

  return isSubscribed ? (
    <Button
      isLoading={isUnsubscriptionLoading}
      onClick={() => unsubscribe()}
      className="w-full mt-1 mb-4"
    >
      Leave community
    </Button>
  ) : (
    <Button
      isLoading={isSubscriptionLoading}
      onClick={() => subscribe()}
      className="w-full mt-1 mb-4"
    >
      Join to post
    </Button>
  );
};

export default SubscribeLeaveToggle;
