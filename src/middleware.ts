import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = (
	{ locals, redirect, request },
	next,
) => {
	// console.log(new URL(request.url).pathname);
	// // intercept data from a request
	// // optionally, modify the properties in `locals`
	// if (!new URL(request.url).pathname.endsWith("login")) {
	// 	const user = locals?.user;
	// 	if (!user?.username) return redirect("/login");

	// 	locals.username = user.username;
	// }
	// return a Response or the result of calling `next()`
	return next();
};
