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
                "delwarn",
                "mute",
                "unmute",
                "kick",
                "ban",
                "unban",
                "channel-lock",
                "channel-unlock",
            ],
        }).notNull(),
        guildId: text("guildId").notNull(),
        memberId: text("memberId"),
        userId: text("userId"),
        channelId: text("channelId"),
        moderatorId: text("moderatorId").notNull(),
        reason: text("reason"),
    },
);

export const persistedRoles = sqliteTable(
    "persistedRoles",
    {
        id: defaultId,
        createdAt: defaultDate("createdAt"),
        userId: text("userId").notNull(),
        memberId: text("memberId").notNull(),
        guildId: text("guildId").notNull(),
        roleId: text("roleId").notNull(),
        reason: text("reason"),
    },
);

export const guildConfigs = sqliteTable(
    "guildConfigs",
    {
        id: defaultId,
        createdAt: defaultDate("createdAt"),
        guildId: text("guildId").notNull(),
        mutedRoleId: text("mutedRole"),
        moderatorRoleId: text("moderatorRoleId"),
        adminRoleId: text("adminRoleId"),
    },
);