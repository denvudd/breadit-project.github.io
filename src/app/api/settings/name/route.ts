import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NameValidator } from "@/lib/validators/settings/name";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { name } = NameValidator.parse(body);

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name,
      },
    });

    return new Response("Your name has been updated successfully");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("Could not update name, please try again later", {
      status: 500,
    });
  }
}
