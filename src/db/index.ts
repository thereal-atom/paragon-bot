import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import config from "../config";
import * as schema from "./schema";

const dbOptions = config.database.connectionType === "local-replica" ? {
    url: "file:local.sqlite",
    authToken: config.database.token,
    syncUrl: config.database.url,
} : {
    url: config.database.url,
    authToken: config.database.token,
};

export const client = createClient(dbOptions);
client.sync().catch(console.error);

export const db = drizzle(client, { schema });