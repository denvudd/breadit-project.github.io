"use client";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { User } from "@prisma/client";
import React from "react";
import UserAvatar from "./UserAvatar";
import { DropdownMenuContent } from "./ui/DropdownMenu";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { List, LogOut, Settings, Users2 } from "lucide-react";

interface UserAccountNavProps {
  user: Pick<User, "name" | "image" | "email">;
}

const UserAccountNav: React.FC<UserAccountNavProps> = ({ user }) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{
            name: user.name || null,
            image: user.image || null,
          }}
          className="h-8 w-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white dark:bg-slate-900" align="end">
        <div className="flex items-center justify-center gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-zinc-700 dark:text-zinc-200">
                {user.email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/" className="cursor-pointer">
            <List className="mr-2 h-4 w-4" />
            Feed
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/r/create" className="cursor-pointer">
            <Users2 className="mr-2 h-4 w-4" />
            Create community
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}/sign-in`,
            });
          }}
          className="cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
