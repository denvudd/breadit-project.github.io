"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/DropdownMenu";
import { useClipboard } from "@mantine/hooks";
import { Forward } from "lucide-react";
import React from "react";

interface SharePostProps {
  subredditName: string;
  subredditId: string;
}

const SharePost: React.FC<SharePostProps> = ({
  subredditName,
  subredditId,
}) => {
  const path =
    typeof window !== "undefined" &&
    `${window.location.origin}/r/${subredditName}/post/${subredditId}`;
  const { copy } = useClipboard();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="w-fit flex items-center gap-2 pl-3 sm:pl-0">
        <Forward className="w-5 h-5" />
        Share
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => copy(path)}>Link</DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${path}`}
            target="_blank"
          >
            Facebook
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`https://twitter.com/intent/tweet?text=Welcome%20To%20Breaddit%20@reddit&url=${path}`}
            target="_blank"
          >
            Twitter
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SharePost;
