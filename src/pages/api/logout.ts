import lucia from "@/lib/auth";
import { session$ } from "@/store";
import type { APIRoute } from "astro";

export const ALL: APIRoute = async ({ redirect, cookies }) => {
	if (!session$.value?.id) {
		return new Response(null, {
			status: 401,
		});
	}

	await lucia.invalidateSession(session$.get().id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies.delete(sessionCookie.name, sessionCookie.attributes);
	cookies.delete('auth_session')
	cookies.delete("github_oauth_state");

	return redirect("/login");
};
