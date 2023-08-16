"use client";

import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import UserAvatar from "../UserAvatar";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { ImageIcon, Link2 } from "lucide-react";

interface CreatePostProps {
  session: Session | null;
}

const CreatePost: React.FC<CreatePostProps> = ({ session }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <li className="overflow-hidden rounded-md bg-white dark:bg-slate-900 shadow list-none">
      <div className="h-full px-4 sm:px-6 py-4 flex justify-between gap-6">
        <div className="relative">
          <UserAvatar
            user={{
              name: session?.user.name || null,
              image: session?.user.image || null,
            }}
            className="border-2 border-gray-300 dark:border-slate-950"
          />
          <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-white"></span>
        </div>
        <Input
          readOnly
          onClick={() => router.push(`${pathname}/submit`)}
          placeholder="Create post"
        />
        <Button
          variant="ghost"
          onClick={() => router.push(`${pathname}/submit`)}
          className="hidden sm:inline-flex"
        >
          <ImageIcon className="text-zinc-600 dark:text-zinc-400" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => router.push(`${pathname}/submit`)}
          className="hidden sm:inline-flex"
        >
          <Link2 className="text-zinc-600 dark:text-zinc-400" />
        </Button>
      </div>
    </li>
  );
};

export default CreatePost;
