import React from "react";
import { Input } from "./ui/Input";
import { Edit } from "lucide-react";

interface EditSubredditNameProps {
  subredditId: string;
  subredditName: string;
}

const EditSubredditName: React.FC<EditSubredditNameProps> = ({
  subredditId,
  subredditName,
}) => {
  return (
    <div className="relative group">
      <Input
        className="font-bold text-3xl md:text-4xl h-8 border-none px-0 py-0 bg-transparent group-hover:opacity-75 w-full"
        defaultValue={subredditName}
      />
      <span className="hidden group-hover:block absolute bottom-0 right-0 top-0">
        <Edit />
      </span>
    </div>
  );
};

export default EditSubredditName;
