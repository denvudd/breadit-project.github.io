import React from "react";
import PostVoteShell from "../post-vote/PostVoteShell";
import { Skeleton } from "../ui/Skeleton";

const PostShell: React.FC = ({}) => {
  return (
    <li className="rounded-md bg-white dark:bg-slate-900 shadow">
      <div className="p-4 flex justify-between">
        <PostVoteShell />
        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 flex items-center gap-1">
            <Skeleton className="h-4 w-full max-w-[80px]" />
            <Skeleton className="h-1 w-1 rounded-full" />
            <Skeleton className="h-4 w-full max-w-[160px]" />
          </div>

          <Skeleton className="my-2 h-7 w-full max-w-[200px]" />

          <div className="relative max-h-40 w-full overflow-clip">
            <Skeleton className="py-2 h-5 w-full my-1" />
            <Skeleton className="py-2 h-5 w-full my-1" />
            <Skeleton className="py-2 h-5 w-full my-1" />
            <Skeleton className="py-2 h-5 w-full my-1" />
          </div>
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-900 z-20 p-4 sm:px-6">
        <Skeleton className="h-5 w-[30px]" />
      </div>
    </li>
  );
};

export default PostShell;
