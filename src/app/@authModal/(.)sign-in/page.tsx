"use client"

import React from "react";
import SignIn from "@/components/SignIn";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/Dialog";
import { useRouter } from "next/navigation";

const page: React.FC = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid gap-4 py-4">
          <SignIn/>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default page;
