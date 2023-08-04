"use client";

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
} from "./ui/Card";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  type AboutRequest,
  AboutValidator,
} from "@/lib/validators/settings/about";

interface UserNameFormProps {
  user: Pick<User, "id" | "username">;
}

const UserAboutForm: React.FC<UserNameFormProps> = ({ user }) => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AboutRequest>({
    resolver: zodResolver(AboutValidator),
    defaultValues: {
      about: user?.username || "",
    },
  });

  const { mutate: changeUsername, isLoading: isUsernameLoading } = useMutation({
    mutationFn: async ({ about }: AboutRequest) => {
      const payload: AboutRequest = { about };

      const { data } = await axios.patch(`/api/settings/about`, payload);
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
          <CardTitle>About (optional)</CardTitle>
          <CardDescription>
            A brief description of yourself shown on your profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative grid gap-1">
            <Label className="sr-only" htmlFor="about">
              About (optional)
            </Label>
            <Input
              id="about"
              className="w-[400px] pl-6"
              size={32}
              {...register("about")}
            />
            {errors?.about && (
              <p className="px-1 text-xs text-red-600">{errors.about.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button isLoading={isUsernameLoading}>Save</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UserAboutForm;
