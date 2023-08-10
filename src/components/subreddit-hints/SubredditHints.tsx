import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { Button, buttonVariants } from "../ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../ui/Card";
import { hintsData } from "./hints";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/Collabsiple";
import { ChevronsUpDown } from "lucide-react";

interface SubredditHintsProps {
  slug: string;
}

const SubredditHints: React.FC<SubredditHintsProps> = ({ slug }) => {
  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 px-4 py-2 rounded-md">
      <Collapsible defaultOpen>
        <div className="flex items-center justify-between">
          <p className="font-semibold">Grow your community</p>
          <CollapsibleTrigger asChild>
            <Button title="Toggle" variant="ghost" size="sm" className="w-9 p-0">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="flex flex-col gap-2 my-2">
            {hintsData.map((hint, index) => (
              <Card key={index} className="bg-zinc-100 dark:bg-slate-950">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    {hint.icon}
                    <div>
                      <CardTitle className="text-xl">{hint.title}</CardTitle>
                      <CardDescription>{hint.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-end">
                  <Link
                    className={cn(
                      buttonVariants({
                        className: hint.buttonStyle,
                      })
                    )}
                    href={`/r/${slug}/${hint.action}`}
                  >
                    {hint.buttonText}
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default SubredditHints;
