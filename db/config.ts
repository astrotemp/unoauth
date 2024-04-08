import { defineDb, column, defineTable,  } from "astro:db";

const User = defineTable({
	columns: {
		id: column.text({
			primaryKey: true,
		}),
		username: column.text(),
		hashed_password: column.text({
			optional: true
		}),
		github_id: column.number({
			unique: true,
			optional: true,
		}),
		authType: column.text({
			optional: true
		}) // github or google or hash_password 
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
	tables: { User, Session },
});
