import UserAboutForm from "@/components/UserAboutForm";
import UserNameForm from "@/components/UserNameForm";
import { authOptions, getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

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
      id: session.user.id
    }
  })

  return (
    <div className="max-4-xl mx-auto py-12">
      <div className="grid items-start gap-8">
        <h1 className="font-bold text-3xl md:text-4xl mb-2">Settings</h1>
      </div>
      <div className="grid gap-10">
        <UserNameForm
          user={{
            id: session.user.id,
            username: user?.username || "",
          }}
        />
        <UserAboutForm
          user={{
            id: session.user.id,
            about: user?.about || "",
          }}
        />
      </div>
    </div>
  );
};

export default page;
