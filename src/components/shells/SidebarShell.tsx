import React from "react";
import { Skeleton } from "../ui/Skeleton";

const SidebarShell: React.FC = ({}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-300 dark:border-gray-600 order-first md:order-last">
        <div className="px-6 py-4 bg-zinc-100 dark:bg-gray-950 flex items-center justify-between">
          <Skeleton className="h-5 my-3 w-full max-w-[150px] bg-gray-300" />
          <Skeleton className="h-4 w-4 bg-gray-300" />
        </div>

        <div className="flex flex-col gap-2 w-full px-6 pt-4 bg-white dark:bg-slate-900">
          <div>
            <Skeleton className="h-6 w-full max-w-[100px]" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-600 px-6 py-4 bg-white dark:bg-slate-900">
          <div className="flex justify-between gap-x-4 py-3">
            <Skeleton className="h-6 w-full max-w-[90px]" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-6" />
            </div>
          </div>

          <div className="flex justify-between gap-x-4 py-3">
            <Skeleton className="h-6 w-full max-w-[70px]" />
            <div>
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-6" />
              </div>
            </div>
          </div>

          <Skeleton className="w-full mb-4 h-10" />
          <Skeleton className="w-full mb-4 h-10" />
        </div>
      </div>

      <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-300 dark:border-gray-600 order-first md:order-last">
        <p className="bg-white dark:bg-slate-900 px-6 py-4 border-b border-gray-300 dark:border-gray-600">
          <Skeleton className="h-5 w-full max-w-[190px]" />
        </p>

        <div className="w-full px-6 pt-2 pb-4 bg-white dark:bg-slate-900">
          {[...Array(3)].map((_, i) => (
            <Skeleton className="h-5 w-full max-w-[260px] my-4" key={i} />
          ))}
        </div>
      </div>

      <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-300 dark:border-gray-600 order-first md:order-last">
        <p className="bg-white dark:bg-slate-900 px-6 py-4 border-b border-gray-300 dark:border-gray-600">
          <Skeleton className="h-5 w-full max-w-[190px]" />
        </p>

        <div className="flex flex-col gap-2 w-full px-6 py-4 bg-white dark:bg-slate-900">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full max-w-[260px]" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarShell;
