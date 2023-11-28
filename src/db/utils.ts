import { int } from "drizzle-orm/sqlite-core";

export const defaultId = int("id").primaryKey({ autoIncrement: true });
export const defaultDate = (name: string) => int(name, { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date());