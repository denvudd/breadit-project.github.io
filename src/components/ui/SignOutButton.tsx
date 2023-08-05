"use client";

import { signOut } from "next-auth/react";
import React from "react";
import { Button, buttonVariants } from "./Button";

const SignOutButton: React.FC = ({}) => {
  return (
    <Button
      onClick={(event) => {
        event.preventDefault();
        signOut({
          callbackUrl: `${window.location.origin}/sign-in`,
        });
      }}
      className={buttonVariants({
        variant: "destructive",
      })}
    >
      Sign Out
    </Button>
  );
};

export default SignOutButton;
