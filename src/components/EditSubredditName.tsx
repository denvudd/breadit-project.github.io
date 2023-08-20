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

interface EditSubredditNameProps {
  subredditId: string;
  subredditName: string;
}

const EditSubredditName: React.FC<EditSubredditNameProps> = ({
  subredditId,
  subredditName,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isButtonVisible, setIsButtonVisible] = React.useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SubredditNamePayload>({
    resolver: zodResolver(SubredditNameValidator),
    defaultValues: {
      subredditId,
      name: subredditName ?? null,
    },
  });

  const { ref: nameRef, ...rest } = register("name");
  const _nameRef = React.useRef<HTMLTextAreaElement>(null);
  const watchValue = watch("name");

  console.log(watchValue);

  const { mutate: changeName, isLoading: isNameLoading } = useMutation({
    mutationFn: async ({ name, subredditId }: SubredditNamePayload) => {
      const payload: SubredditNamePayload = { name, subredditId };

      const { data } = await axios.patch(`/api/subreddit/info/name`, payload);
      return data;
    },
    onError: () => {
      toast({
        title: "There was an error",
        description: "Could not change name for this subreddit.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Name for this subreddit has been updated.",
      });

      router.refresh();
    },
  });

  const onSubmit = async (data: SubredditNamePayload) => {
    const payload: SubredditNamePayload = {
      subredditId: data.subredditId,
      name: data.name,
    };

    changeName(payload);
  };

  return (
    <form action="" onSubmit={handleSubmit(onSubmit)} className="flex gap-1">
      <div className="relative group">
        <Input
          className="font-bold text-3xl md:text-4xl h-8 border-none px-0 py-0 bg-transparent group-hover:opacity-75 w-full"
          defaultValue={subredditName}
          {...rest}
          ref={(e) => {
            nameRef(e);
            // @ts-ignore
            _nameRef.current = e;
          }}
        />
        <span className="hidden group-hover:block bottom-0 absolute w-3 h-3 right-4 top-1">
          <Edit />
        </span>
      </div>
      {watchValue !== subredditName && (
        <Button type="submit" variant="outline" size="xs" className="ml-3">
          {isNameLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Check className="w-5 h-5" />
          )}
        </Button>
      )}
    </form>
  );
};

export default EditSubredditName;
