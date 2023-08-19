"use client";

import Image from "next/image";
import React from "react";
import FileDialog, { FileWithPreview } from "./file-dialog/FileDialog";
import { Form, FormControl, FormItem } from "./ui/Form";
import { useForm } from "react-hook-form";
import { useUploadThing } from "@/lib/uploadthing";
import { isArrayOfFile } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/Button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/Dialog";
import { useMutation } from "@tanstack/react-query";
import { SubredditAvatarPayload } from "@/lib/validators/subreddit";
import axios from "axios";

interface SubredditAvatarProps {
  avatar: string | null;
  subredditName: string;
  subredditId: string;
}

const SubredditAvatar: React.FC<SubredditAvatarProps> = ({
  avatar,
  subredditName,
  subredditId,
}) => {
  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null);
  const [isPending, startTransition] = React.useTransition();
  const form = useForm();
  const { toast } = useToast();

  const { isUploading, startUpload } = useUploadThing(
    "subredditAvatarUploader"
  );

  const { mutate: changeAvatar, isLoading: isAvatarLoading } = useMutation({
    mutationFn: async ({ subredditId, avatar }: SubredditAvatarPayload) => {
      const payload: SubredditAvatarPayload = { avatar, subredditId };

      const { data } = await axios.patch(`/api/subreddit/info/avatar`, payload);
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

        changeAvatar({ subredditId, avatar: images?.at(0)?.url });
      } catch (err) {
        console.log(err);
      }
    });
  }

  return (
    <>
      <div className="relative inline-block group">
        {avatar ? (
          <Image
            src={avatar}
            width={72}
            height={72}
            alt={`${subredditName} avatar`}
            className="w-16 h-16 rounded-full border-4 border-white group-hover:opacity-75"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            className="w-16 h-16 rounded-full border-4 border-white bg-zinc-100 fill-blue-600 group-hover:opacity-75"
          >
            <path d="M16.5,2.924,11.264,15.551H9.91L15.461,2.139h.074a9.721,9.721,0,1,0,.967.785ZM8.475,8.435a1.635,1.635,0,0,0-.233.868v4.2H6.629V6.2H8.174v.93h.041a2.927,2.927,0,0,1,1.008-.745,3.384,3.384,0,0,1,1.453-.294,3.244,3.244,0,0,1,.7.068,1.931,1.931,0,0,1,.458.151l-.656,1.558a2.174,2.174,0,0,0-1.067-.246,2.159,2.159,0,0,0-.981.215A1.59,1.59,0,0,0,8.475,8.435Z"></path>
          </svg>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <button className="hidden group-hover:block absolute bottom-0 left-0 rounded-b-full w-full bg-black bg-opacity-70 text-white text-center py-2 text-xs cursor-pointer">
              Change
            </button>
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
                          size="sm"
                          className="mt-2.5 w-full"
                          onClick={() => form.trigger()}
                          isLoading={isUploading || isAvatarLoading}
                        >
                          Submit
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
    </>
  );
};

export default SubredditAvatar;
