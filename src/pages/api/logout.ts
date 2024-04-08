import lucia from "@/lib/auth";
import type { APIRoute } from "astro";

export const post: APIRoute = async ({ locals, redirect, cookies }) => {
	if (!locals.session) {
		return new Response(null, {
			status: 401,
		});
	}

	await lucia.invalidateSession(locals.session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies.set(
		sessionCookie.name,
		sessionCookie.value,
		sessionCookie.attributes,
	);

	return redirect("/login");
};
