import lucia from "@/lib/auth";
import { Scrypt, generateId } from "lucia";
import type { APIRoute } from "astro";
import { usernameSchema, passwordSchema } from "@/lib/validation";
import { db, User, eq } from "astro:db";
import { session$, user$ } from "@/store";


export const POST: APIRoute = async ({ request, cookies, redirect, locals }) => {
	const formData = await request.formData();
	const username = formData.get("username") as string;
	if (!username || !usernameSchema.safeParse(username).success)
		return new Response("Invalid Username", { status: 400 });

	const password = formData.get("password") as string;
	if (!password || !passwordSchema.safeParse(password).success)
		return new Response("Invalid Password", { status: 400 });

	const [existingUser] = await db
		.select()
		.from(User)
		.where(eq(User.username, username)); // username.toLowerCase()

	if (!existingUser?.hashed_password) {
		return new Response("Incorrect username or password", { status: 400 });
	}
	const validPassword = await new Scrypt().verify(
		existingUser.hashed_password,
		password,
	);
	if (!validPassword)
		return new Response("Incorrect password or username", { status: 400 });

	const session = await lucia.createSession(existingUser.id, {});
	session$.set(session)
	user$.set(existingUser)
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies.set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes,
	);
	
	return redirect("/");
};
