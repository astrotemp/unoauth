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
}


export {github} from './github'
export default lucia