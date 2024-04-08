import { generateState, generateCodeVerifier } from "arctic";
import { google } from "@/lib/auth/google";

import type { APIRoute } from "astro";
export const codeVerifier = generateCodeVerifier();

export const GET: APIRoute = async ({ cookies, redirect }) => {
	const state = generateState();

	const url = await google.createAuthorizationURL(state, codeVerifier, {
		scopes: ["profile", "email", "openid"],
	});
	cookies.set("google_oauth_state", state, {
		path: "/",
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: "lax",
	});

	return redirect(url.toString());
};
