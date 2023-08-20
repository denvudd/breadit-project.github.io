"use client";

import React from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/Card";
import type { User } from "@prisma/client";
import "@uploadthing/react/styles.css";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Image from "next/image";
import { useForm } from "react-hook-form";
import FileDialog, { type FileWithPreview } from "../file-dialog/FileDialog";
import { isArrayOfFile } from "@/lib/utils";
import { Form, FormControl, FormItem } from "../ui/Form";
import { Dialog, DialogContent, DialogTrigger } from "../ui/Dialog";

interface AvatarFormProps {
  user: Pick<User, "id" | "image">;
}

const AvatarForm: React.FC<AvatarFormProps> = ({ user }) => {
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const form = useForm();
  const { toast } = useToast();

  const { isUploading, startUpload } = useUploadThing("userAvatarUploader");

  const { mutate: changeAvatar, isLoading: isAvatarLoading } = useMutation({
    mutationFn: async ({ avatar }: { avatar: string | undefined }) => {
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

      form.reset();
      setFiles(null);
      window.location.reload();
    },
  });

  function onSubmit(data: any) {
    startTransition(async () => {
      try {
        const images = isArrayOfFile(data.images)
          ? await startUpload(data.images).then((res) => {
              const formattedImages = res?.map((image) => ({
                id: image.fileKey,
                name: image.fileKey.split("_")[1] ?? image.fileKey,
                url: image.fileUrl,
              }));
              return formattedImages ?? null;
            })
          : null;

        changeAvatar({ avatar: images?.at(0)?.url });
      } catch (err) {
        console.log(err);
      }
    });
  }

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
          <div className="">
            <Label className="sr-only" htmlFor="avatar">
              Avatar
            </Label>
            {user.image && (
              <div className="flex flex-col gap-2 mb-6">
                <p className="text-sm text-muted-foreground">Current photo:</p>
                <div className="flex gap-3 items-center">
                  <a href={user.image}>
                    <Image
                      src={user.image}
                      className="w-32 h-32 rounded-full"
                      width={128}
                      height={128}
                      alt="profile avatar"
                    />
                  </a>
                  <a href={user.image}>
                    <Image
                      src={user.image}
                      className="w-16 h-16 rounded-full"
                      width={64}
                      height={64}
                      alt="profile avatar"
                    />
                  </a>
                  <a href={user.image}>
                    <Image
                      src={user.image}
                      className="w-10 h-10 rounded-full"
                      width={40}
                      height={40}
                      alt="profile avatar"
                    />
                  </a>
                </div>
              </div>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button>Change avatar</Button>
              </DialogTrigger>
              <DialogContent>
                <Form {...form}>
                  <form
                    onSubmit={(...args) =>
                      void form.handleSubmit(onSubmit)(...args)
                    }
                  >
                    <FormItem>
                      <FormControl>
                        <>
                          <FileDialog
                            setValue={form.setValue}
                            name="images"
                            maxFiles={1}
                            maxSize={1024 * 1024 * 2}
                            files={files}
                            setFiles={setFiles}
                            isUploading={isUploading}
                            disabled={isPending}
                          />
                          {files?.length ? (
                            <Button
                              type="submit"
                              className="mt-2.5 w-full"
                              size="sm"
                              isLoading={isAvatarLoading || isUploading}
                              onClick={() => form.trigger()}
                            >
                              Save avatar
                              <span className="sr-only">Submit</span>
                            </Button>
                          ) : null}
                        </>
                      </FormControl>
                    </FormItem>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvatarForm;
