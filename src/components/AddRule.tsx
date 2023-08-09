"use client";

import {
  type SubredditRulePayload,
  SubredditRuleValidator,
} from "@/lib/validators/subreddit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { Button, buttonVariants } from "./ui/Button";
import { Label } from "./ui/Label";
import { useLoginToast } from "@/hooks/use-login-toast";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";

interface AddRuleProps {
  subredditId: string;
}

const AddRule: React.FC<AddRuleProps> = ({ subredditId }) => {
  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const router = useRouter();
  const { loginToast } = useLoginToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubredditRulePayload>({
    resolver: zodResolver(SubredditRuleValidator),
    defaultValues: {
      subredditId,
      title: "",
      description: undefined,
    },
  });
  const { mutate: createRule, isLoading: isRuleLoading } = useMutation({
    mutationFn: async ({
      title,
      description,
      subredditId,
    }: SubredditRulePayload) => {
      const payload: SubredditRulePayload = {
        subredditId,
        title,
        description,
      };
      const { data } = await axios.post(
        "/api/subreddit/info/rules/create",
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
        description: "Your rule was not published, please try again later.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      setIsVisible(false);
      reset();
      router.refresh();

      return toast({
        description: "Your rule for subreddit has been published.",
      });
    },
  });

  const { ref: titleRef, ...titleRest } = register("title");
  const { ref: descrRef, ...descrRest } = register("description");
  const _titleRef = React.useRef<HTMLTextAreaElement>(null);
  const _descrRef = React.useRef<HTMLTextAreaElement>(null);

  const onSubmit = async (data: SubredditRulePayload) => {
    const payload: SubredditRulePayload = {
      title: data.title,
      description: data.description,
      subredditId,
    };

    createRule(payload);
  };

  return (
    <div className="w-full">
      {!isVisible && (
        <Button
          onClick={() => setIsVisible(true)}
          className={buttonVariants({
            variant: "subtle",
            size: "sm",
            className: "w-full justify-start",
          })}
        >
          Add new rule
        </Button>
      )}
      {isVisible && (
        <form
          action=""
          className="flex flex-col gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="prose prose-stone dark:prose-invert">
            <Label className="text-xs">Title</Label>
            <TextareaAutosize
              ref={(e) => {
                titleRef(e);
                // @ts-ignore
                _titleRef.current = e;
              }}
              {...titleRest}
              title="Title"
              placeholder="Title"
              className="w-full resize-none appearance-none overflow-hidden focus:outline-none flex 
              rounded-md border border-input bg-transparent px-3 py-2 text-sm 
              ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none 
              focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
              disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors?.title && (
              <p className="px-1 text-xs text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="prose prose-stone dark:prose-invert">
            <Label className="text-xs">Description (optional)</Label>
            <TextareaAutosize
              ref={(e) => {
                descrRef(e);
                // @ts-ignore
                _descrRef.current = e;
              }}
              {...descrRest}
              title="Description"
              placeholder="Description (optional)"
              className="w-full resize-none appearance-none overflow-hidden focus:outline-none flex 
              rounded-md border border-input bg-transparent px-3 py-2 text-sm 
              ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none 
              focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
              disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors?.description && (
              <p className="px-1 text-xs text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="flex md:justify-end gap-2 w-full">
            <Button
              size="sm"
              variant="subtle"
              onClick={() => setIsVisible(false)}
            >
              Cancel
            </Button>
            <Button size="sm" type="submit" isLoading={isRuleLoading}>
              Save
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddRule;
