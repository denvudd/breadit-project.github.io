import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditNameValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { name, subredditId } = SubredditNameValidator.parse(body);

    const subscribtionExists = await db.subreddit.findFirst({
      where: {
        id: subredditId,
        creatorId: session.user.id,
      },
    });

    if (!subscribtionExists) {
      return new Response("Subreddit doesn't exist", {
        status: 400,
      });
    }

    const isAuthor = await db.subreddit.findFirst({
      where: {
        id: subredditId,
        creatorId: session.user.id,
      },
    });

    if (!isAuthor) {
      return new Response("You are not owner of this subreddit", {
        status: 401,
      });
    }

    await db.subreddit.update({
      where: {
        id: subredditId,
      },
      data: {
        name,
      },
    });

    return new Response("Name for this subreddit has been updated successfully");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Could not update name for this subreddit, please try again later", {
      status: 500,
    });
  }
}
