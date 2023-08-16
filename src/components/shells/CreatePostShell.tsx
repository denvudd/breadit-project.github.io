import React from "react";
import { Skeleton } from "../ui/Skeleton";

const CreatePostShell: React.FC = ({}) => {
  return (
    <li className="overflow-hidden rounded-md bg-white dark:bg-slate-900 shadow list-none">
      <div className="h-full px-6 py-4 flex justify-between gap-6">
        <div className="relative">
          <Skeleton className="border-2 border-gray-300 dark:border-slate-950 h-10 w-10 rounded-full" />
          <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-gray-500 outline outline-2 outline-white"></span>
        </div>
        <Skeleton className="flex h-10 w-full rounded-md" />
        <Skeleton className="inline-flex items-center justify-center rounded-md h-10 py-2 px-4" />
        <Skeleton className="inline-flex items-center justify-center rounded-md h-10 py-2 px-4" />
      </div>
    </li>
  );
};

export default CreatePostShell;
