"use client";

import React from "react";
import SignUp from "@/components/SignUp";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { useRouter } from "next/navigation";

const page: React.FC = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid gap-4 py-4">
          <SignUp />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default page;
