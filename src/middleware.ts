import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = ({ locals, redirect }, next) => {
	// intercept data from a request
	// optionally, modify the properties in `locals`
	const user = locals?.user;
	if (!user?.username) return redirect("/login");

	locals.username = user.username;
	// return a Response or the result of calling `next()`
	return next();
};
