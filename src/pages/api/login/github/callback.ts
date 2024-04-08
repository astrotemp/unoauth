import lucia, { github } from "@/lib/auth";
import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";
import { db, User, eq } from "astro:db";
import type { APIRoute } from "astro";
interface GitHubUser {
	id: string;
	login: string;
}

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const storedState = cookies.get("github_oauth_state")?.value;
	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400,
		});
	}

	try {
		const tokens = await github.validateAuthorizationCode(code);
		const githubUser: GitHubUser = await fetch("https://api.github.com/user", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`,
			},
		}).then((r) => r.json());

		const [existingUser] = await db
			.select()
			.from(User)
			.where(eq(User.github_id, +githubUser.id));

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
		await db.insert(User).values({
			id: userId,
			username: githubUser.login,
			github_id: +githubUser.id,
		});

		const session = await lucia.createSession(userId, {});
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
