import React from "react";
import Link from "next/link";
import { Icons } from "./ui/Icons";
import { buttonVariants } from "./ui/Button";
import { getAuthSession } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";
import SearchBar from "./SearchBar";
import { db } from "@/lib/db";
import ToggleTheme from "./ToggleTheme";
import SubscribesCommand from "./SubscribesCommand";

const Navbar = async () => {
  const session = await getAuthSession();

  const user = await db.user.findFirst({
    where: {
      id: session?.user.id,
    },
    include: {
      Subscription: {
        select: {
          subreddit: {
            select: {
              name: true,
              avatar: true,
              creatorId: true,
              id: true,
            },
          },
        },
      },
    },
  });

  const moderating = user?.Subscription?.filter(
    ({ subreddit }) => subreddit.creatorId === session?.user.id
  );

  return (
    <div className="fixed top-0 inset-x-0 h-fit border-b border-zinc-300 dark:border-none z-[10] py-2 bg-slate-100 dark:bg-slate-900">
      <div className="container max-w-full h-full mx-auto flex justify-between gap-2 md:grid md:grid-cols-3">
        <Link href={"/"} className="flex gap-2 items-center flex-nowrap">
          <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6" />
          <p className="hidden text-zinc-700 text-sm font-medium md:block dark:text-zinc-100">
            Breaddit
          </p>
          <SubscribesCommand subscriptions={user?.Subscription} moderating={moderating} />
        </Link>
        <SearchBar />
        <div className="flex gap-2 items-center justify-end">
          <ToggleTheme />
          {session?.user && user ? (
            <UserAccountNav user={user} />
          ) : (
            <Link href="/sign-in" className={buttonVariants()}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
