import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { defaultDate, defaultId } from "../../db/utils";

// warn, ban, kick, un ban, mute, unmute, etc is a moderation action type
export const moderationActions = sqliteTable(
    "moderationActions",
    {
        id: defaultId,
        createdAt: defaultDate("createdAt"),
        type: text("type", {
            enum: [
                "warn",
                "mute",
                "unmute",
                "kick",
                "ban",
                "unban",
            ],
        }).notNull(),
        memberId: text("memberId").notNull(),
        moderatorId: text("moderatorId").notNull(),
        reason: text("reason"),
    },
);