import React from "react";

import SignUp from "@/components/SignUp";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const page: React.FC = ({}) => {
  return (
    <div className="absolute inset-0">
      <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "ghost" }), 'self-start -mt-20')}
        >Home</Link>
        <SignUp/>
      </div>
    </div>
  );
};

export default page;