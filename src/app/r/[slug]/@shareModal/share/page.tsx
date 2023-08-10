/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useClipboard } from "@mantine/hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Facebook, Link, Twitter } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button, buttonVariants } from "@/components/ui/Button";
import { clsx } from "clsx";

const Page: React.FC = () => {
  const router = useRouter();
  const path = window.location.href.replace("/share", "");
  const { copy, copied } = useClipboard({ timeout: 2000 });

  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="border-b border-zinc-400">
          <DialogTitle className="pb-4">Share this subreddit</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm">Share this link via</p>
          <div className="flex justify-around my-4">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${path}`}
              target="_blank"
            >
              <Facebook
                className="border hover:bg-[#1877f2] w-12 h-12 fill-[#1877f2] hover:fill-white 
              border-blue-200 rounded-full flex items-center justify-center cursor-pointer p-3"
              />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=Welcome%20To%20Subreddit%20@reddit&url=${path}`}
              target="_blank"
            >
              <Twitter
                className="border hover:bg-[#1d9bf0] w-12 h-12 fill-[#1d9bf0] hover:fill-white border-blue-200 
                rounded-full flex items-center justify-center  cursor-pointer p-3"
              />
            </a>
          </div>
          <p className="text-sm">Or copy link</p>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <div className="relative grid gap-1">
              <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
                <Link className="w-4 h-4 text-zinc-400" />
              </div>
              <span className="sr-only">Copy link</span>
              <Input readOnly className="pl-8" size={32} value={path} />
            </div>
            <Button
              className={buttonVariants({
                className: clsx(
                  "text-white dark:text-white bg-blue-500 dark:bg-blue-500 hover:bg-blue-500 dark:hover:bg-blue-500",
                  {
                    "bg-green-500 dark:bg-green-500 hover:bg-green-500 dark:hover:bg-green-500":
                      copied,
                  }
                ),
              })}
              onClick={() => copy(path)}
            >
              Copy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Page;
