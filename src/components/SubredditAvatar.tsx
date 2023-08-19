"use client";
import { useUploadThing } from "@/lib/uploadthing";
import type { FileWithPath } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button, buttonVariants } from "./ui/Button";
import { useRouter } from "next/navigation";

interface SubredditAvatarProps {
  avatar: string | null;
  subredditName: string;
}

const SubredditAvatar: React.FC<SubredditAvatarProps> = ({
  avatar,
  subredditName,
}) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const onDrop = React.useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });
  const { isUploading, startUpload } = useUploadThing(
    "subredditAvatarUploader",
    {
      onClientUploadComplete: () => {
        toast({
          description: "Avatar for this subreddit has been updated.",
        });
        router.refresh();
      },
      onUploadError: () => {
        console.log("error occurred while uploading");
      },
    }
  );

  React.useEffect(() => {
    if (files.length > 0) {
      toast({
        description: "Change the avatar of this subreddit?",
        duration: 10000,
        action: (
          <Button
            className={buttonVariants({
              variant: "outline",
              size: "sm",
            })}
            isLoading={isUploading}
            onClick={() => startUpload(files)}
          >
            Submit
          </Button>
        ),
      });
    }
  }, [files]);

  return (
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
      <div
        {...getRootProps()}
        className="hidden group-hover:block absolute bottom-0 left-0 rounded-b-full w-full bg-black bg-opacity-70 text-white text-center py-2 text-xs cursor-pointer"
      >
        <input {...getInputProps()} />
        <button>Change</button>
      </div>
    </div>
  );
};

export default SubredditAvatar;
