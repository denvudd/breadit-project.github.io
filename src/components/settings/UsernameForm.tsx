"use client";

import { UsernameRequest, UsernameValidator } from "@/lib/validators/settings/username";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface UserNameFormProps {
  user: Pick<User, "id" | "username">;
}

const UsernameForm: React.FC<UserNameFormProps> = ({ user }) => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UsernameRequest>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      username: user?.username || "",
    },
  });

  const { mutate: changeUsername, isLoading: isUsernameLoading } = useMutation({
    mutationFn: async ({ username }: UsernameRequest) => {
      const payload: UsernameRequest = { username };

      const { data } = await axios.patch(`/api/settings/username`, payload);
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast({
            title: "Username already taken",
            description: "Please choose a different username.",
            variant: "destructive",
          });
        }
      }

      toast({
        title: "There was an error",
        description: "Could not create subreddit.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Your username has been updated.",
      });

      router.refresh();
    },
  });

  return (
    <form action="" onSubmit={handleSubmit((e) => changeUsername(e))}>
      <Card>
        <CardHeader>
          <CardTitle>Username</CardTitle>
          <CardDescription>
            Please enter a display username you are comfortable with.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
              <span className="text-sm text-zinc-400">u/</span>
            </div>
            <Label className="sr-only" htmlFor="username">
              Name
            </Label>
            <Input
              id="name"
              className="w-[400px] pl-6"
              size={32}
              {...register("username")}
              placeholder="username"
            />
            {errors?.username && (
              <p className="px-1 text-xs text-red-600">{errors.username.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button isLoading={isUsernameLoading}>Save username</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UsernameForm;
