import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditDeleteLinkValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { subredditId, linkId } = SubredditDeleteLinkValidator.parse(body);

    const subredditExist = await db.subreddit.findFirst({
      where: {
        id: subredditId,
        creatorId: session.user.id,
      },
    });

    if (!subredditExist) {
      return new Response(
        "Subreddit doesn't exists or you are not owner of this subreddit",
        { status: 404 }
      );
    }

    await db.subredditLink.delete({
      where: {
        id: linkId,
      },
    });

    return new Response(
      "Link for this subreddit has been successfully deleted"
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not delete this link", { status: 500 });
  }
}
