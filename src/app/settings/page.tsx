import AvatarForm from "@/components/settings/AvatarForm";
import NameForm from "@/components/settings/NameForm";
import AboutForm from "@/components/settings/AboutForm";
import UsernameForm from "@/components/settings/UsernameForm";
import { authOptions, getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import GenderForm from "@/components/settings/GenderForm";
import EmailForm from "@/components/settings/EmailForm";
import { Button } from "@/components/ui/Button";
import { signOut } from "next-auth/react";
import SignOutButton from "@/components/ui/SignOutButton";

export const metadata = {
  title: "Settings",
  description: "Menage account and website settings",
};

const page = async ({}) => {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect(authOptions.pages?.signIn || "/sign-in");
  }

  const user = await db.user.findFirst({
    where: {
      id: session.user.id,
    },
  });

  return (
    <div className="max-4-xl mx-auto py-12">
      <div className="grid items-start gap-8">
        <h1 className="font-bold text-3xl md:text-4xl mb-2">Settings</h1>
      </div>
      <div className="grid gap-6">
        <AvatarForm
          user={{
            id: session.user.id,
            image: user?.image || "",
          }}
        />
        <UsernameForm
          user={{
            id: session.user.id,
            username: user?.username || "",
          }}
        />
        <EmailForm
          user={{
            id: session.user.id,
            email: user?.email || "",
          }}
        />
        <NameForm
          user={{
            id: session.user.id,
            name: user?.name || "",
          }}
        />
        <AboutForm
          user={{
            id: session.user.id,
            about: user?.about || "",
          }}
        />
        <GenderForm
          user={{
            id: session.user.id,
            gender: user?.gender || null,
          }}
        />
        <div className="flex justify-end">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
};

export default page;
