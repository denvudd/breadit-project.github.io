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
} from "./ui/DropdownMenu";
import { ArrowDown, Home, List, Plus } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/Command";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

type PartialSubscribtion = {
  subreddit: {
    name: string;
    avatar: string | null;
    id: string;
    creatorId: string | null;
  };
};

interface SubscribtionsCommandProps {
  subscriptions: PartialSubscribtion[] | undefined;
  moderating: PartialSubscribtion[] | undefined;
}

const SubscribesCommand: React.FC<SubscribtionsCommandProps> = ({
  subscriptions,
  moderating,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <div
          className="flex w-fit gap-2 sm:gap-3 justify-between flex-row items-center"
          onClick={() => setOpen(true)}
        >
          |
          <p className="text-xs hidden lg:block lg:text-sm font-medium leading-none">
            <span className="text-muted-foreground">Communities</span>
          </p>
          <ChevronDown className="w-4 h-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <Command>
            <CommandInput placeholder="Filter label..." autoFocus={true} />
            <CommandList>
              <CommandEmpty>Not found.</CommandEmpty>
              <CommandGroup heading="Your communities">
                {subscriptions?.map(({ subreddit }) => (
                  <CommandItem key={subreddit.id}>
                    <Link
                      href={`/r/${subreddit.name}`}
                      className="flex items-center"
                    >
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
              <CommandSeparator />
              <CommandGroup heading="Moderating">
                {moderating?.map(({ subreddit }) => (
                  <CommandItem key={subreddit.id}>
                    <Link
                      href={`/r/${subreddit.name}`}
                      className="flex items-center"
                    >
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
              <CommandSeparator />
              <CommandGroup heading="Feeds">
                <CommandItem>
                  <Link className="flex items-center" href="/">
                    <Home className="mr-2 h-5 w-5" />
                    Home
                  </Link>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Other">
                <CommandItem>
                  <Link className="flex items-center" href="/r/create">
                    <Plus className="mr-2 h-5 w-5" />
                    Create community
                  </Link>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SubscribesCommand;
