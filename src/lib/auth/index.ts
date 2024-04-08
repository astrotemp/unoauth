import { Lucia } from "lucia";
import { AstroDBAdapter } from "lucia-adapter-astrodb";
import { db, Session, User } from "astro:db";

const lucia = new Lucia(new AstroDBAdapter(db, Session, User), {
	sessionCookie: {
		attributes: {
			secure: import.meta.env.PROD,
		},
	},
	getUserAttributes: (userAttributes) => ({
		github_id: userAttributes?.github_id,
		username: userAttributes.username,
		google_id: userAttributes?.google_id,
	}),
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}
export interface DatabaseUserAttributes {
	github_id?: number;
	username: string;
	google_id?: number;
}

export { github } from "./github";
export { google } from "./google";
export default lucia;
