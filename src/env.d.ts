/// <reference path="../.astro/db-types.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
import type { Session } from "lucia";

declare namespace App {
	interface Locals {
		user?: {
			username: string;
			github_id: number|null;
			authType: string|null;
			id: string | number
			hashed_password: string|null
		};
		id?: string | number;
		github_id?: number;
		session?: Session;
	}
}

interface ImportMetaEnv {
	readonly GITHUB_CLIENT_ID: string;
	readonly GITHUB_CLIENT_SECRET: string;
	readonly GOOGLE_CLIENT_ID: string;
	readonly GOOGLE_CLIENT_SECRET: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
