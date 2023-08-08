import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditRuleValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { subredditId, title, description } =
      SubredditRuleValidator.parse(body);

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

    await db.rule.create({
      data: {
        name: title,
        description,
        subredditId,
      },
    });

    return new Response("Your rule for subreddit has been published");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response(
      "Could not create rule for subreddit at this time, please try again later",
      {
        status: 500,
      }
    );
  }
}
