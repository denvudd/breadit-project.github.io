import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditAboutValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { about, subredditId } = SubredditAboutValidator.parse(body);

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

    await db.subreddit.update({
      where: {
        id: subredditId,
      },
      data: {
        about,
      },
    });

    return new Response(
      "About text for this subreddit has been updated successfully"
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Could not update about text, please try again later", {
      status: 500,
    });
  }
}
