"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuShortcut,
} from "./ui/DropdownMenu";
import { ArrowDown, Calendar, Tags, Trash, User } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/Command";
import Image from "next/image";
import Link from "next/link";

interface SubscribtionsCommandProps {
  subscriptions:
    | {
        subreddit: {
          name: string;
          avatar: string | null;
          id: string;
        };
      }[]
    | undefined;
}

const SubscribtionsCommand: React.FC<SubscribtionsCommandProps> = ({
  subscriptions,
}) => {
  const [open, setOpen] = React.useState(false);
  console.log(subscriptions);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <div
          className="flex w-full max-w-[72px] md:max-w-[210px] flex-col items-start justify-between rounded-md border px-3 py-3 sm:flex-row sm:items-center"
          onClick={() => setOpen(true)}
        >
          <p className="text-sm font-medium leading-none">
            <span className="text-muted-foreground">Home</span>
          </p>
          <ArrowDown />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <Command>
            <CommandInput placeholder="Filter label..." autoFocus={true} />
            <CommandList>
              <CommandEmpty>Not found.</CommandEmpty>
              <DropdownMenuLabel>Your communities</DropdownMenuLabel>
              <CommandGroup>
                {subscriptions?.map(({ subreddit }) => (
                  <CommandItem key={subreddit.id}>
                    <Link href={`/r/${subreddit.name}`} className="flex items-center">
                      {subreddit.avatar && (
                        <Image
                          src={subreddit.avatar}
                          width={16}
                          height={16}
                          alt={subreddit.name + " avatar"}
                          className="mr-2 h-5 w-5 rounded-full"
                        />
                      )}
                      r/{subreddit.name}
                    </Link>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Tags className="mr-2 h-4 w-4" />
              Apply label
            </DropdownMenuSubTrigger>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">
            <Trash className="mr-2 h-4 w-4" />
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SubscribtionsCommand;
