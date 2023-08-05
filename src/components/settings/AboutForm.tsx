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
} from "../ui/Card";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  type AboutRequest,
  AboutValidator,
} from "@/lib/validators/settings/about";
import { Textarea } from "../ui/Textarea";

interface UserAboutFormProps {
  user: Pick<User, "id" | "about">;
}

const AboutForm: React.FC<UserAboutFormProps> = ({ user }) => {
  const router = useRouter();  

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AboutRequest>({
    resolver: zodResolver(AboutValidator),
    defaultValues: {
      about: user?.about || "",
    },
  });

  const { mutate: changeAbout, isLoading: isAboutLoading } = useMutation({
    mutationFn: async ({ about }: AboutRequest) => {
      const payload: AboutRequest = { about };

      const { data } = await axios.patch(`/api/settings/about`, payload);
      return data;
    },
    onError: () => {
      toast({
        title: "There was an error",
        description: "Could not create subreddit.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Your biography has been updated.",
      });

      router.refresh();
    },
  });

  return (
    <form action="" onSubmit={handleSubmit((e) => changeAbout(e))}>
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
            <Textarea
              id="about"
              className="w-[400px]"
              {...register("about")}
              placeholder="About (optional)"
            />
            {errors?.about && (
              <p className="px-1 text-xs text-red-600">
                {errors.about.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button isLoading={isAboutLoading}>Change biography</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default AboutForm;
