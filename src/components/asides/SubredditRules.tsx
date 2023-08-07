import { Rule } from "@prisma/client";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/Accordion";
import React from "react";
import AddRule from "../AddRule";

interface SubredditRulesProps {
  rules: Rule[];
  subredditName: string;
  subredditId: string;
  isAuthor: boolean;
}

const SubredditRules: React.FC<SubredditRulesProps> = ({
  rules,
  subredditName,
  subredditId,
  isAuthor,
}) => {
  return (
    <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-300 dark:border-gray-600 order-first md:order-last">
      <p className="bg-white dark:bg-slate-900 px-6 py-4">
        r/{subredditName} rules
      </p>
      {isAuthor && (
        <div className="flex flex-col w-full px-6 bg-white dark:bg-slate-900">
          <p className="text-gray-500 dark:text-gray-300 text-sm w-full mb-2">
            Help subscribers understand the rules of this subreddit and explain
            to them how they should behave and what is not acceptable.
          </p>
          <AddRule subredditId={subredditId} />
        </div>
      )}
      <Accordion
        type="single"
        collapsible
        className="w-full px-6 pt-4 bg-white dark:bg-slate-900 text-sm leading-6"
      >
        {rules.map((rule, index) => (
          <AccordionItem key={rule.id} value={rule.id}>
            <AccordionTrigger>{index + 1}. {rule.name}</AccordionTrigger>
            {rule.description && (
              <AccordionContent>{rule.description}</AccordionContent>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default SubredditRules;
