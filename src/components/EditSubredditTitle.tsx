"use client";

import React from "react";
import { Input } from "./ui/Input";
import { Check, Edit, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type SubredditNamePayload,
  SubredditNameValidator,
} from "@/lib/validators/subreddit";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/Button";

interface EditSubredditTitleProps {
  subredditId: string;
  subredditTitle: string;
}

const EditSubredditTitle: React.FC<EditSubredditTitleProps> = ({
  subredditId,
  subredditTitle,
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SubredditNamePayload>({
    resolver: zodResolver(SubredditNameValidator),
    defaultValues: {
      subredditId,
      title: subredditTitle ?? null,
    },
  });

  const { ref: titleRef, ...rest } = register("title");
  const _titleRef = React.useRef<HTMLTextAreaElement>(null);
  const watchValue = watch("title");

  const { mutate: changeTitle, isLoading: isTitleLoading } = useMutation({
    mutationFn: async ({ title, subredditId }: SubredditNamePayload) => {
      const payload: SubredditNamePayload = { title, subredditId };

      const { data } = await axios.patch(`/api/subreddit/info/name`, payload);
      return data;
    },
    onError: () => {
      toast({
        title: "There was an error",
        description: "Could not change title for this subreddit.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Title for this subreddit has been updated.",
      });

      router.refresh();
    },
  });

  const onSubmit = async (data: SubredditNamePayload) => {
    const payload: SubredditNamePayload = {
      subredditId: data.subredditId,
      title: data.title,
    };

    changeTitle(payload);
  };

  return (
    <form action="" onSubmit={handleSubmit(onSubmit)} className="flex gap-1">
      <div className="relative group">
        <Input
          className="font-bold text-3xl md:text-4xl h-8 border-none px-0 py-0 bg-transparent group-hover:opacity-75 w-full"
          defaultValue={subredditTitle}
          {...rest}
          ref={(e) => {
            titleRef(e);
            // @ts-ignore
            _titleRef.current = e;
          }}
        />
        {errors?.title && (
          <p className="absolute left-0 top-[-5px]">{errors.title.message}</p>
        )}
        <span className="hidden group-hover:block bottom-0 absolute w-3 h-3 right-4 top-1">
          <Edit />
        </span>
      </div>
      {watchValue !== subredditTitle && (
        <Button type="submit" variant="outline" size="xs" className="ml-3">
          {isTitleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Check className="w-5 h-5" />
          )}
        </Button>
      )}
    </form>
  );
};

export default EditSubredditTitle;
