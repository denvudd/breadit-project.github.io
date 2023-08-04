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
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { NameValidator, NameRequest } from "@/lib/validators/settings/name";

interface NameFormProps {
  user: Pick<User, "id" | "name">;
}

const NameForm: React.FC<NameFormProps> = ({ user }) => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<NameRequest>({
    resolver: zodResolver(NameValidator),
    defaultValues: {
      name: user?.name || "",
    },
  });

  const { mutate: changeName, isLoading: isNameLoading } = useMutation({
    mutationFn: async ({ name }: NameRequest) => {
      const payload: NameRequest = { name };

      const { data } = await axios.patch(`/api/settings/name`, payload);
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
        description: "Your name has been updated.",
      });

      router.refresh();
    },
  });

  return (
    <form action="" onSubmit={handleSubmit((e) => changeName(e))}>
      <Card>
        <CardHeader>
          <CardTitle>Display name (optional)</CardTitle>
          <CardDescription>
            Set a display name. This does not change your username.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative grid gap-1">
            <Label className="sr-only" htmlFor="name">
              Display name
            </Label>
            <Input
              id="name"
              className="w-[400px]"
              size={32}
              {...register("name")}
              placeholder="Display name (optional)"
            />
            {errors?.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button isLoading={isNameLoading}>Change name</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default NameForm;
