"use client";

import React from "react";
import axios, { AxiosError } from "axios";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import type { CreateSubredditPayload } from "@/lib/validators/subreddit";
import { toast } from "@/hooks/use-toast";
import { useLoginToast } from "@/hooks/use-login-toast";

const Page = () => {
  const [input, setInput] = React.useState<string>("");
  const { loginToast } = useLoginToast();
  const { mutate: createCommunity, isLoading: isCreatingLoading } = useMutation(
    {
      mutationFn: async () => {
        const payload: CreateSubredditPayload = {
          name: input,
        };
        const { data } = await axios.post("/api/subreddit", payload);

        return data as string;
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          // if subredit already exists
          if (error.response?.status === 409) {
            return toast({
              title: "Subreddit already exists",
              description: "Please choose a different subreddit name.",
              variant: "destructive",
            });
          }

          // if invalid subreddit name
          if (error.response?.status === 422) {
            return toast({
              title: "Invalid subreddit name",
              description: "Please choose a name between 3 and 21 characters.",
              variant: "destructive",
            });
          }

          // if user are unauthorized
          if (error.response?.status === 401) {
            return loginToast();
          }
        }

        toast({
          title: "There was an error",
          description: "Could not create subreddit.",
          variant: "destructive",
        });
      },
      onSuccess: (data) => {
        router.push(`/r/${data}`)
      }
    }
  );
  const router = useRouter();

  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto">
      <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-5">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Create community</h1>
        </div>

        <hr className="bg-zinc-500 h-px" />

        <div className="">
          <p className="text-lg font-medium">Name</p>
          <p className="text-xs pb-2">
            Community names including capitalization cannot be changed.
          </p>
          <div className="relative">
            <div className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
              r/
            </div>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-6"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="subtle" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            isLoading={isCreatingLoading}
            disabled={input.length === 0}
            onClick={() => createCommunity()}
          >
            Create community
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
