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

interface AddRuleProps {
  subredditId: string;
}

const AddRule: React.FC<AddRuleProps> = ({ subredditId }) => {
  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubredditRulePayload>({
    resolver: zodResolver(SubredditRuleValidator),
    defaultValues: {
      subredditId,
      title: "",
      description: undefined,
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

    // createRule(payload);
  };

  return (
    <div className="w-full">
      {!isVisible && (
        <Button
          onClick={() => setIsVisible(true)}
          className={buttonVariants({
            variant: "subtle",
            size: "sm",
            className: "w-full justify-start mb-4",
          })}
        >
          Add rule
        </Button>
      )}
      {isVisible && (
        <form
          action=""
          className="flex flex-col gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="prose prose-stone dark:prose-invert">
            <Label className="text-xs">
              Title
            </Label>
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
            <Label className="text-xs">
              Description (optional)
            </Label>
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
          <div className="flex md:justify-end w-full">
            <Button type="submit">Save</Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddRule;
