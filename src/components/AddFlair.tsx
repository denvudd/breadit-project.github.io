"use client";

import { useLoginToast } from "@/hooks/use-login-toast";
import { toast } from "@/hooks/use-toast";
import {
  type SubredditFlairPayload,
  SubredditFlairValidator,
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

interface AddFlairProps {
  subredditId: string;
}

const AddFlair: React.FC<AddFlairProps> = ({ subredditId }) => {
  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const router = useRouter();
  const { loginToast } = useLoginToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubredditFlairPayload>({
    resolver: zodResolver(SubredditFlairValidator),
    defaultValues: {
      subredditId,
      name: "",
      color: "#FFB000",
    },
  });

  const { mutate: createFlair, isLoading: isFlairLoading } = useMutation({
    mutationFn: async ({ name, color, subredditId }: SubredditFlairPayload) => {
      const payload: SubredditFlairPayload = {
        subredditId,
        name,
        color,
      };
      const { data } = await axios.post(
        "/api/subreddit/info/flairs/create",
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
        description: "Your flair was not published, please try again later.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      setIsVisible(false);
      reset();
      router.refresh();

      return toast({
        description: "Your flair for subreddit has been published.",
      });
    },
  });

  const { ref: nameRef, ...nameRest } = register("name");
  const { ref: colorRef, ...colorRest } = register("color");
  const _nameRef = React.useRef<HTMLInputElement>(null);
  const _colorRef = React.useRef<HTMLInputElement>(null);

  const onSubmit = async (data: SubredditFlairPayload) => {
    const payload: SubredditFlairPayload = {
      name: data.name,
      color: data.color,
      subredditId,
    };

    createFlair(payload);
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
          Add new flair
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
              <Label className="text-xs">Name</Label>
              <Input
                ref={(e) => {
                  nameRef(e);
                  // @ts-ignore
                  _nameRef.current = e;
                }}
                {...nameRest}
                title="Name"
                placeholder="Name"
              />
              {errors?.name && (
                <p className="px-1 text-xs text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="prose prose-stone dark:prose-invert w-full">
              <Label className="text-xs">Color</Label>
              <Input
                ref={(e) => {
                  colorRef(e);
                  // @ts-ignore
                  _colorRef.current = e;
                }}
                {...colorRest}
                title="Color"
                type="color"
                placeholder="https://www.reddit.com"
              />
              {errors?.color && (
                <p className="px-1 text-xs text-red-600">
                  {errors.color.message}
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
            <Button size="sm" type="submit" isLoading={isFlairLoading}>
              Save
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddFlair;
