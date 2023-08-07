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
        <div className="flex w-full px-6 bg-white dark:bg-slate-900">
          <AddRule subredditId={subredditId} />
        </div>
      )}
      <Accordion type="single" collapsible>
        {rules.map((rule) => (
          <AccordionItem key={rule.id} value="item-1">
            <AccordionTrigger>{rule.name}</AccordionTrigger>
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
