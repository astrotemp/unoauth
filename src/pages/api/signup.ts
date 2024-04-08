import { generateId, Scrypt } from "lucia";
import type { APIRoute } from "astro";
import { db, User } from "astro:db";
import lucia from "@/lib/auth";
import { passwordSchema, usernameSchema } from "@/lib/validation";


export const POST: APIRoute = async ({ request, cookies, redirect }) => {
	const formData = await request.formData();
	const username = formData.get("username") as string;
	if (!username || !usernameSchema.safeParse(username).success)
		return new Response("Invalid Username", { status: 400 });

	const password = formData.get("password");
	if (!password || !passwordSchema.safeParse(password).success)
		return new Response("Invalid Password", { status: 400 });

	const userId = generateId(15);
	const hashedPassword = await new Scrypt().hash(password.toString());

	await db.insert(User).values({
		id: userId,
		username,
		hashed_password: hashedPassword,
	});
	const session = await lucia.createSession(userId, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies.set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes,
	);

	return redirect("/");
};
