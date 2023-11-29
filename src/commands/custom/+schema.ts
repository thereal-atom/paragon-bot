import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { defaultDate, defaultId } from "../../db/utils";

export const customCommands = sqliteTable(
    "customCommands",
    {
        id: defaultId,
        createdAt: defaultDate("createdAt"),
        guildId: text("guildId").notNull(),
        creatorUserId: text("guildId").notNull(),
        name: text("name").notNull(),
        response: text("response").notNull(),
    },
);