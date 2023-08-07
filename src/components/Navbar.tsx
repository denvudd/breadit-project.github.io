import React from "react";
import Link from "next/link";
import { Icons } from "./ui/Icons";
import { Button, buttonVariants } from "./ui/Button";
import { getAuthSession } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";
import SearchBar from "./SearchBar";
import { db } from "@/lib/db";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/DropdownMenu";
import { Sun, Moon } from "lucide-react";
import ToggleTheme from "./ToggleTheme";

const Navbar = async () => {
  const session = await getAuthSession();

  const user = await db.user.findFirst({
    where: {
      id: session?.user.id,
    },
  });

  return (
    <div className="fixed top-0 inset-x-0 h-fit border-b border-zinc-300 dark:border-none z-[10] py-2 bg-slate-100 dark:bg-slate-900">
      <div className="container max-w-full h-full mx-auto flex items-center justify-between gap-2">
        <Link href={"/"} className="flex gap-2 items-center">
          <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6" />
          <p className="hidden text-zinc-700 text-sm font-medium md:block dark:text-zinc-100">
            Breaddit
          </p>
        </Link>
        <SearchBar />
        <div className="flex gap-2 items-center">
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
