import { eq, sql } from "drizzle-orm";
import {
    moderationActions as moderationActionsTable,
    persistedRoles as persistedRolesTable,
    guildConfigs as guildConfigsTable,
} from "./+schema";
import { db } from "../../db";

export type ModerationAction = typeof moderationActionsTable["$inferSelect"];
type DatabaseModerationActionData = typeof moderationActionsTable["$inferInsert"];

export const createDatabaseModerationAction = async (data: DatabaseModerationActionData) => {
    const moderationActions = await db
        .insert(moderationActionsTable)
        .values(data)
        .returning();

    return moderationActions[0];
};

export const getDatabaseModerationAction = async (filterData: { id: number }) => {
    const filter = eq(moderationActionsTable.id, filterData.id);

    const moderationActions = await db
        .select()
        .from(moderationActionsTable)
        .where(filter);

    return moderationActions[0];
};

export const deleteDatabaseModerationAction = async (filterData: { id: number }) => {
    const filter = eq(moderationActionsTable.id, filterData.id);

    await db
        .delete(moderationActionsTable)
        .where(filter);
};

export const countModerationActions = async (filterData: {
    moderatorId: string;
    // memberId?: string;
    // type?: DatabaseModerationActionData["type"];
}) => {
    const result = await db
        .select({
            count: sql<number>`cast(count(${moderationActionsTable.id}) as int)`,
        })
        .from(moderationActionsTable)
        .where(eq(moderationActionsTable.moderatorId, filterData.moderatorId));

    return result[0].count;
};

export type PersistedRole = typeof persistedRolesTable["$inferSelect"];
type DatabasePersistedRoleData = typeof persistedRolesTable["$inferInsert"];

export const createDatabasePersistedRole = async (data: DatabasePersistedRoleData) => {
    const persistedRoles = await db
        .insert(persistedRolesTable)
        .values(data)
        .returning();

    return persistedRoles[0];
};

export const getDatabasePersistedRole = async (filterData: { id: number }) => {
    const filter = eq(persistedRolesTable.id, filterData.id);

    const persistedRoles = await db
        .select()
        .from(persistedRolesTable)
        .where(filter);

    return persistedRoles[0];
};

export const deleteDatabasePersistedRole = async (filterData: { id: number }) => {
    const filter = eq(persistedRolesTable.id, filterData.id);

    await db
        .delete(persistedRolesTable)
        .where(filter);
};

export type GuildConfig = typeof guildConfigsTable["$inferSelect"];
type DatabaseGuildConfigData = typeof guildConfigsTable["$inferInsert"];

export const createDatabaseGuildConfig = async (data: DatabaseGuildConfigData) => {
    const guildConfigs = await db
        .insert(guildConfigsTable)
        .values(data)
        .returning();

    return guildConfigs[0];
};

type GuildConfigFilterData = {
    id: number;
    guildId?: undefined;
} | {
    id?: undefined;
    guildId: string;
};

export const getDatabaseGuildConfig = async (filterData: GuildConfigFilterData) => {
    const filter
        = filterData.id ? eq(guildConfigsTable.id, filterData.id)
        : filterData.guildId ? eq(guildConfigsTable.guildId, filterData.guildId)
        : undefined;

    const guildConfigs = await db
        .select()
        .from(guildConfigsTable)
        .where(filter);

    return guildConfigs[0];
};

export const updateDatabaseGuildConfig = async (
    filterData: GuildConfigFilterData,
    data: Pick<DatabaseGuildConfigData, "mutedRoleId" | "moderatorRoleId" | "adminRoleId">,
) => {
    const filter
        = filterData.id ? eq(guildConfigsTable.id, filterData.id)
        : filterData.guildId ? eq(guildConfigsTable.guildId, filterData.guildId)
        : undefined;

    const newGuildConfigs = await db
        .update(guildConfigsTable)
        .set(data)
        .where(filter)
        .returning();

    return newGuildConfigs[0];
};

export const deleteDatabaseGuildConfig = async (filterData: GuildConfigFilterData) => {
    const filter
        = filterData.id ? eq(guildConfigsTable.id, filterData.id)
        : filterData.guildId ? eq(guildConfigsTable.guildId, filterData.guildId)
        : undefined;

    await db
        .delete(guildConfigsTable)
        .where(filter);
};

export const getOrCreateDatabaseGuildConfig = async (
    filterData: GuildConfigFilterData,
    data: DatabaseGuildConfigData,
) => {
    let guildConfig = await getDatabaseGuildConfig(filterData);

    if (guildConfig) {
        return guildConfig;
    };

    guildConfig = await createDatabaseGuildConfig(data);

    return guildConfig;
};