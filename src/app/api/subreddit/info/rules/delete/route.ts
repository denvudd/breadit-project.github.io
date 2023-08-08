import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditDeleteRuleValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { subredditId, ruleId } = SubredditDeleteRuleValidator.parse(body);

    const subredditExist = await db.subreddit.findFirst({
      where: {
        id: subredditId,
        creatorId: session.user.id,
      },
    });

    if (!subredditExist) {
      return new Response("Subreddit doesn't exists or you are not owner of this subreddit", { status: 404 });
    }

    await db.rule.delete({
      where: {
        id: ruleId,
      }
    })

    return new Response("Rule for this subreddit has been successfully deleted");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("Could not delete rule", { status: 500 });
  }
}
