import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../ui/Card";
import { hintsData } from "./hints";

interface SubredditHintsProps {
  slug: string;
}

const SubredditHints: React.FC<SubredditHintsProps> = ({ slug }) => {
  return (
    <div className="flex flex-col bg-zinc-100 dark:bg-slate-900 px-4 pb-4 pt-2 rounded-md">
      <p className="font-semibold py-3">Grow your community</p>
      <div className="flex flex-col gap-1">
        {hintsData.map((hint, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-start gap-3">
                {hint.icon}
                <div>
                  <CardTitle>{hint.title}</CardTitle>
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
                href={`r/${slug}/${hint.action}`}
              >
                {hint.buttonText}
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubredditHints;
