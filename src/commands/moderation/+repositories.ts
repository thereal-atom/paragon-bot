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