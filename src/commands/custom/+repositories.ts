import { eq } from "drizzle-orm";
import { customCommands as customCommandsTable } from "./+schema";
import { db } from "../../db";

export type CustomCommand = typeof customCommandsTable["$inferSelect"];
type DatabaseCustomCommandData = typeof customCommandsTable["$inferInsert"];

export const createDatabaseCustomCommand = async (data: DatabaseCustomCommandData) => {
    const customCommands = await db
        .insert(customCommandsTable)
        .values(data)
        .returning();

    return customCommands[0];
};

type FilterData = {
    id: number;
    name?: undefined;
} | {
    id?: undefined;
    name: string;
};

export const getDatabaseCustomCommand = async (filterData: FilterData) => {
    const filter =
        filterData.id ? eq(customCommandsTable.id, filterData.id)
        : filterData.name ? eq(customCommandsTable.name, filterData.name)
        : undefined;

    const customCommands = await db
        .select()
        .from(customCommandsTable)
        .where(filter);

    return customCommands[0];
};

export const deleteDatabaseCustomCommand = async (filterData: FilterData) => {
    const filter =
        filterData.id ? eq(customCommandsTable.id, filterData.id)
        : filterData.name ? eq(customCommandsTable.name, filterData.name)
        : undefined;

    await db
        .delete(customCommandsTable)
        .where(filter);
};