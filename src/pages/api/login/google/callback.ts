import lucia, { google } from "@/lib/auth";
import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";
import { db, User, eq } from "astro:db";
import type { APIRoute } from "astro";
import { codeVerifier } from ".";
interface GoogleUser {
	sub: string;
	id: string;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	email: string;
	email_verified: boolean;
	locale: string;
}

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const storedState = cookies.get("google_oauth_state")?.value;

	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400,
		});
	}

	try {
		const tokens = await google
			.validateAuthorizationCode(code, codeVerifier)
			.catch((e) => console.log("Could not authorize", e));
		const googleUser: GoogleUser = await fetch(
			"https://openidconnect.googleapis.com/v1/userinfo",
			{
				headers: {
					Authorization: `Bearer ${tokens?.accessToken}`,
				},
			},
		)
			.then((r) => r.json())
			.then((user) => {
				user.id = +user.sub;
				return user;
			});
		console.log({ googleUser });

		const [existingUser] = await db
			.select()
			.from(User)
			.where(eq(User.google_id, +googleUser.id))
			.catch((e) => {
				console.log("could not find the user", e);
				return [{ id: "error" }];
			});

		if (existingUser?.id) {
			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(
				sessionCookie.name,
				sessionCookie.value,
				sessionCookie.attributes,
			);
			return redirect("/");
		}

		const userId = generateId(15);
		await db
			.insert(User)
			.values({
				id: userId,
				username: `${googleUser.given_name}-${googleUser.family_name}`,
				google_id: +googleUser.id,
			})
			.catch((e) => console.log("could not create db entry", e));

		const session = await lucia.createSession(userId, {}).catch((e) => {
			console.log("could not create session", e);
			return { id: "error" };
		});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies.set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);
		return redirect("/");
	} catch (e) {
		return new Response(null, {
			status: e instanceof OAuth2RequestError ? 400 : 500,
		});
	}
};
