import type { MiddlewareHandler } from "astro";
import { session$, user$ } from "./store";
import lucia from "@/lib/auth";
const protectedRoutes = ["/"];

export const onRequest: MiddlewareHandler = async (
	{ redirect, cookies, request, locals },
	next,
) => {
	const currentURL = new URL(request.url).pathname;
	const { user, session } = await lucia.validateSession(
		cookies.get(lucia.sessionCookieName)?.value || "",
	);
	if (!user?.id || !session?.id)
		if (protectedRoutes.includes(currentURL)) return redirect("/login");

	if (user?.id && ["/login", "/register"].includes(currentURL))
		return redirect("/");

	locals = { ...locals, session, user };

	if (user) user$.set(user);
	if (session) session$.set(session);

	return next();
};
