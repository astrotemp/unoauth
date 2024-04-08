import {z} from 'astro/zod'

export const usernameSchema = z
	.string()
	.min(3, {
		message: "Username must be between 3 and 31 characters.",
	})
	.max(31, {
		message: "Username must be between 3 and 31 characters.",
	})
	.regex(/^[a-z0-9_-]+$/, {
		message:
			"Only lowercase letters, numbers, underscores, and hyphens are allowed.",
	});

export const passwordSchema = z
	.string()
	.min(6, {
		message: "Password must be between 6 and 255 characters.",
	})
	.max(255, { message: "Password must be between 6 and 255 characters." });
