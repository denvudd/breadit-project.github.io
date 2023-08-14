import React from "react";
import PostShell from "./PostShell";

interface PostFeedShellProps {}

const PostFeedShell: React.FC<PostFeedShellProps> = ({}) => {
  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {[...Array(5)].map((_, i) => (
        <PostShell key={i} />
      ))}
    </ul>
  );
};

export default PostFeedShell;
