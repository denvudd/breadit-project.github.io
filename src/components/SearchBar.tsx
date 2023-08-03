"use client";

import React from "react";
import { Command, CommandInput } from "./ui/Command";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Prisma, Subreddit } from "@prisma/client";

interface SearchBarProps {}

const SearchBar: React.FC<SearchBarProps> = ({}) => {
  const [input, setInput] = React.useState<string>("");

  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      if (!input) return [];
      const { data } = await axios.get(`/api/search?q=${input}`);
      return data as Subreddit & {
        _count: Prisma.SubredditCountOutputType;
      };
    },
    queryKey: ["search-query"],
    enabled: false,
  });

  return (
    <Command className="relative rounded-lg border max-w-7xl z-50 overflow-visible mx-2">
      <CommandInput
        className="outline-none border-none focus:border-none focus:outline-none ring-0"
        placeholder="Search communities..."
        value={input}
        onValueChange={(text) => {
          setInput(text);
        }}
      />
    </Command>
  );
};

export default SearchBar;
