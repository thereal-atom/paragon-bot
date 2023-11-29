import { eq } from "drizzle-orm";
import { moderationActions as moderationActionsTable } from "./+schema";
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