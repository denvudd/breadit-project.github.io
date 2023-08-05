"use client";

import { User } from "@prisma/client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";

interface UseremalFormProps {
  user: Pick<User, "id" | "email">;
}

const EmailForm: React.FC<UseremalFormProps> = ({ user }) => {
  return (
    <form action="">
      <Card>
        <CardHeader>
          <CardTitle>Email</CardTitle>
          <CardDescription>
            The email address associated with your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              className="w-[400px] bg-gray-100"
              size={32}
              name="email"
              placeholder={user.email as string}
              readOnly
            />
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default EmailForm;
