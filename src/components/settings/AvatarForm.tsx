"use client";

import React from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/Card";
import type { User } from "@prisma/client";
import "@uploadthing/react/styles.css";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import Image from "next/image";

interface AvatarFormProps {
  user: Pick<User, "id" | "image">;
}

const AvatarForm: React.FC<AvatarFormProps> = ({ user }) => {
  const [avatar, setAvatar] = React.useState<string | null>(user.image);
  const router = useRouter();

  const { mutate: changeAvatar, isLoading: isAvatarLoading } = useMutation({
    mutationFn: async (avatar: string | null) => {
      const payload = { avatar };

      const { data } = await axios.patch(`/api/settings/avatar`, payload);
      return data;
    },
    onError: () => {
      toast({
        title: "There was an error",
        description: "Could not change avatar.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Your avatar has been updated.",
      });

      router.refresh();
    },
  });

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>
            Images must be .png or .jpeg format.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative grid gap-1">
            <Label className="sr-only" htmlFor="name">
              Avatar
            </Label>
            {avatar && (
              <a href={avatar}>
                <Image
                  src={avatar}
                  className="w-40"
                  width={160}
                  height={160}
                  alt="profile avatar"
                />
              </a>
            )}
            <div className="w-80">
              <UploadDropzone
                endpoint="avatarUploader"
                onClientUploadComplete={(res) => {
                  if (res) {
                    setAvatar(res[0].fileUrl);
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            isLoading={isAvatarLoading}
            onClick={() => changeAvatar(avatar)}
          >
            Change avatar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AvatarForm;
