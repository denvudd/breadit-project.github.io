import CreatePostShell from "@/components/shells/CreatePostShell";
import PostFeedShell from "@/components/shells/PostFeedShell";
import { Skeleton } from "@/components/ui/Skeleton";

export default function SubredditLoading() {
  return (
    <div className="sm:container max-w-7xl mx-auto h-full pt-12">
      <div>
        <Skeleton className="h-5 w-full max-w-[160px]" />
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
            <div className="flex flex-col col-span-2 space-y-6">
              <Skeleton className="h-11 w-full max-w-[200px]" />
              <CreatePostShell/>
              <PostFeedShell/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
