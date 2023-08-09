import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditLinkValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { subredditId, title, link } =
      SubredditLinkValidator.parse(body);

    const subscribtionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
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

    await db.subredditLink.create({
      data: {
        title,
        subredditId,
        link,
      }
    })

    return new Response("Your link for subreddit has been published");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response(
      "Could not create link for subreddit at this time, please try again later",
      {
        status: 500,
      }
    );
  }
}
