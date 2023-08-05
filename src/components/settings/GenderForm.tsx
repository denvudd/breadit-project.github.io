"use client";

import {
  GenderRequest,
  GenderValidator,
  genders,
} from "@/lib/validators/settings/gender";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Gender, User } from "@prisma/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface UserNameFormProps {
  user: Pick<User, "id" | "gender">;
}

const GenderForm: React.FC<UserNameFormProps> = ({ user }) => {
  const [selectedGender, setSelectedGender] = React.useState<Gender | null>(
    user.gender
  );
  const router = useRouter();
  console.log(selectedGender);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<GenderRequest>({
    resolver: zodResolver(GenderValidator),
    defaultValues: {
      gender: user?.gender || undefined,
    },
  });

  const { mutate: changeGender, isLoading: isGenderLoading } = useMutation({
    mutationFn: async ({ gender }: GenderRequest) => {
      const payload: GenderRequest = { gender };

      const { data } = await axios.patch(`/api/settings/gender`, payload);
      return data;
    },
    onError: () => {
      toast({
        title: "There was an error",
        description: "Could not change gender, please try again later.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Your gender has been updated.",
      });

      router.refresh();
    },
  });

  const formatFirstLetterToUppercase = (str: string): string => {
    const trimmedString = str.trim().toLocaleLowerCase(); // removing leading spaces
    return trimmedString.charAt(0).toUpperCase() + trimmedString.slice(1);
  };

  return (
    <form action="" onSubmit={handleSubmit((e) => changeGender(e))}>
      <Card>
        <CardHeader>
          <CardTitle>Your gender</CardTitle>
          <CardDescription>
            This information may be used to improve your recommendations and
            ads.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative grid gap-1">
            <Label className="sr-only" htmlFor="username">
              Name
            </Label>

            <Select
              defaultValue={selectedGender as string}
              value={selectedGender as string}
              onValueChange={(value: Gender) => setSelectedGender(value)}
            >
              <SelectTrigger className="w-[400px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {genders.map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {formatFirstLetterToUppercase(gender)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors?.gender && (
              <p className="px-1 text-xs text-red-600">
                {errors.gender.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button isLoading={isGenderLoading}>Change gender</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default GenderForm;
