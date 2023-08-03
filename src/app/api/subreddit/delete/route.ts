import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { DeleteSubredditValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { id } = DeleteSubredditValidator.parse(body);

    const subredditExist = await db.subreddit.findFirst({
      where: {
        id,
        creatorId: session.user.id,
      },
    });

    if (!subredditExist) {
      return new Response("Subreddit doesn't exists", { status: 404 });
    }

    const subreddit = await db.subreddit.delete({
      where: {
        id,
      },
    });

    await db.subscription.deleteMany({
      where: {
        subredditId: subreddit.id,
      },
    });

    return new Response("Subreddit has been successfully deleted");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not delete subreddit", { status: 500 });
  }
}
