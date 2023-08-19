import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditAvatarValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { avatar, subredditId } = SubredditAvatarValidator.parse(body);

    const subreddit = await db.subreddit.findUnique({
      where: {
        id: subredditId,
      },
    });

    if (subreddit && subreddit.creatorId === session.user.id) {
      await db.subreddit.update({
        where: {
          id: subredditId,
        },
        data: {
          avatar,
        },
      });

      return new Response("Your avatar has been updated successfully");
    } else {
      return new Response("You are not the owner of this subreddit");
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Could not update avatar, please try again later", {
      status: 500,
    });
  }
}
