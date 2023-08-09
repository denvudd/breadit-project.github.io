"use client";

import { useLoginToast } from "@/hooks/use-login-toast";
import { toast } from "@/hooks/use-toast";
import {
  type SubredditLinkPayload,
  SubredditLinkValidator,
} from "@/lib/validators/subreddit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Button, buttonVariants } from "./ui/Button";

interface AddLinkProps {
  subredditId: string;
}

const AddLink: React.FC<AddLinkProps> = ({ subredditId }) => {
  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const router = useRouter();
  const { loginToast } = useLoginToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubredditLinkPayload>({
    resolver: zodResolver(SubredditLinkValidator),
    defaultValues: {
      subredditId,
      title: "",
      link: undefined,
    },
  });

  const { mutate: createLink, isLoading: isLinkLoading } = useMutation({
    mutationFn: async ({ title, link, subredditId }: SubredditLinkPayload) => {
      const payload: SubredditLinkPayload = {
        subredditId,
        title,
        link,
      };
      const { data } = await axios.post(
        "/api/subreddit/info/links/create",
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
        description: "Your link was not published, please try again later.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      setIsVisible(false);
      reset();
      router.refresh();

      return toast({
        description: "Your link for subreddit has been published.",
      });
    },
  });

  const { ref: titleRef, ...titleRest } = register("title");
  const { ref: linkRef, ...linkRest } = register("link");
  const _titleRef = React.useRef<HTMLInputElement>(null);
  const _linkRef = React.useRef<HTMLInputElement>(null);

  const onSubmit = async (data: SubredditLinkPayload) => {
    const payload: SubredditLinkPayload = {
      title: data.title,
      link: data.link,
      subredditId,
    };

    createLink(payload);
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
          Add new link
        </Button>
      )}
      {isVisible && (
        <form
          action="#"
          className="flex flex-col gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-full flex flex-wrap md:flex-nowrap gap-2">
            <div className="prose prose-stone dark:prose-invert w-full">
              <Label className="text-xs">Title</Label>
              <Input
                ref={(e) => {
                  titleRef(e);
                  // @ts-ignore
                  _titleRef.current = e;
                }}
                {...titleRest}
                title="Name"
                placeholder="Name"
              />
              {errors?.title && (
                <p className="px-1 text-xs text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="prose prose-stone dark:prose-invert w-full">
              <Label className="text-xs">Link</Label>
              <Input
                ref={(e) => {
                  linkRef(e);
                  // @ts-ignore
                  _linkRef.current = e;
                }}
                {...linkRest}
                title="Description"
                placeholder="https://www.reddit.com"
              />
              {errors?.link && (
                <p className="px-1 text-xs text-red-600">
                  {errors.link.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex md:justify-end gap-2 w-full">
            <Button
              size="sm"
              variant="subtle"
              onClick={() => setIsVisible(false)}
            >
              Cancel
            </Button>
            <Button size="sm" type="submit" isLoading={isLinkLoading}>
              Save
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddLink;
