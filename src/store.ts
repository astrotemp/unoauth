import { atom, map } from "nanostores";

export const user$ =
	map<
		Partial<{
			id: string;
			username: string;
			github_id: number | null;
			authType: string | null;
			hashed_password: string | null;
		}>
	>();

export const session$ = map<import("lucia").Session>();
