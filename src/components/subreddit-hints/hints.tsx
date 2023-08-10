import { Plus, Forward, MessagesSquare } from "lucide-react";

export const hintsData = [
  {
    title: "Time to make your first post!",
    description:
      "Now that you’ve created your community, start things off right by making your first post.",
    icon: (
      <Plus className="w-8 h-8 bg-violet-500 text-zinc-100 rounded-full p-1" />
    ),
    buttonText: "Make Your First Post",
    action: "submit",
    buttonStyle:
      "bg-violet-500 text-zinc-100 dark:bg-violet-500 dark:text-zinc-100 rounded-xl hover:bg-violet-500 dark:hover:bg-violet-500",
  },
  {
    title: "Grow through comments",
    description:
      "Build your community and attract more visitors by mentioning other communities in relevant comments.",
    icon: (
      <MessagesSquare className="w-8 h-8 bg-amber-500 text-zinc-100 rounded-full p-1" />
    ),
    buttonText: "Make Post For Comments",
    action: "submit",
    buttonStyle:
      "bg-amber-500 text-zinc-100 dark:bg-amber-500 dark:text-zinc-100 rounded-xl hover:bg-amber-500 dark:hover:bg-amber-500",
  },
  {
    title: "Share with others",
    description:
      "Don't be shy! Share your community to other users so they can also find out about that.",
    icon: (
      <Forward className="w-8 h-8 bg-green-500 text-zinc-100 rounded-full p-1" />
    ),
    buttonText: "Share This Subreddit",
    action: "share",
    buttonStyle:
      "bg-green-500 text-zinc-100 dark:bg-green-500 dark:text-zinc-100 rounded-xl hover:bg-green-500 dark:hover:bg-green-500",
  },
];
