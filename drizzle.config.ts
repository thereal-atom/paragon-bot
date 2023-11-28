import { Config } from "drizzle-kit";
import config from "./src/config";

export default {
    schema: "./src/db/schema.ts",
    out: "./migrations",
    driver: "turso",
    dbCredentials: {
        url: config.database.url,
        authToken: config.database.token,
    },
} satisfies Config;