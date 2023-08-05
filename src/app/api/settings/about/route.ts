import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { AboutValidator } from "@/lib/validators/settings/about";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { about } = AboutValidator.parse(body);

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        about,
      },
    });

    return new Response("Your biography has been updated successfully");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Could not update biography, please try again later", {
      status: 500,
    });
  }
}
