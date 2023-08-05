"use client";

import React from "react";
import { Button, buttonVariants } from "./ui/Button";
import TextareaAutosize from "react-textarea-autosize";
import {
  type SubredditAboutPayload,
  SubredditAboutValidator,
} from "@/lib/validators/subreddit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface AddAboutProps {
  subredditId: string;
  about: string | null;
}

const AddAbout: React.FC<AddAboutProps> = ({ subredditId, about }) => {
  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubredditAboutPayload>({
    resolver: zodResolver(SubredditAboutValidator),
    defaultValues: {
      subredditId,
      about: about ?? undefined,
    },
  });
  const { ref: aboutRef, ...rest } = register("about");
  const _aboutRef = React.useRef<HTMLTextAreaElement>(null);
  
  const { mutate: changeAbout, isLoading: isAboutLoading } = useMutation({
    mutationFn: async ({ about, subredditId }: SubredditAboutPayload) => {
      const payload: SubredditAboutPayload = { about, subredditId };

      const { data } = await axios.patch(`/api/subreddit/info/about`, payload);
      return data;
    },
    onError: () => {
      toast({
        title: "There was an error",
        description: "Could not change description for this subreddit.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Description for this subreddit has been updated.",
      });

      router.refresh();
      setIsVisible(false);
    },
  });

  const onSubmit = async (data: SubredditAboutPayload) => {
    const payload: SubredditAboutPayload = {
      subredditId: data.subredditId,
      about: data.about,
    };

    changeAbout(payload);
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
          {about ? "Change" : "Add"} description
        </Button>
      )}
      {isVisible && (
        <form
          action=""
          onSubmit={handleSubmit(onSubmit)}
          className="prose prose-stone dark:prose-invert"
        >
          <TextareaAutosize
            ref={(e) => {
              aboutRef(e);
              // @ts-ignore
              _aboutRef.current = e;
            }}
            {...rest}
            placeholder="Tell us about your community"
            defaultValue={about ?? undefined}
            className="w-full resize-none appearance-none overflow-hidden focus:outline-none flex 
            rounded-md border border-input bg-transparent px-3 py-2 text-sm 
            ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none 
            focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
            disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div className="flex space-between items-center w-full">
            <span className="text-xs text-gray-300 w-full">
              500 Characters remaining
            </span>
            <div className="flex md:justify-end gap-2 mt-1 w-full">
              <Button
                className={buttonVariants({
                  variant: "ghost",
                  size: "xs",
                  className:
                    "text-red-500 hover:bg-red-500 hover:text-gray-100 text-xs",
                })}
                onClick={() => setIsVisible(false)}
              >
                Сancel
              </Button>
              <Button
                className={buttonVariants({
                  variant: "ghost",
                  size: "xs",
                  className:
                    "text-green-500 hover:bg-green-500 hover:text-gray-100 text-xs",
                })}
                type="submit"
                isLoading={isAboutLoading}
              >
                Save
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddAbout;
