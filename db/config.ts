import { defineDb, column, defineTable } from "astro:db";

const User = defineTable({
	columns: {
		id: column.text({
			primaryKey: true,
		}),
    username: column.text(),
    github_id: column.number({
      unique: true
    })
	},
});

const Session = defineTable({
	columns: {
		id: column.text({
			primaryKey: true,
		}),
		userId: column.text({
			references: () => User.columns.id,
		}),
		expiresAt: column.date(),
	},
});

// https://astro.build/db/config
export default defineDb({
	tables: {User, Session},
});
