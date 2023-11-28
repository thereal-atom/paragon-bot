import { z } from "zod";

const envSchema = z.object({
    env: z.enum([
        "development",
        "production",
    ]),
    discordBot: z.object({
        token: z.string(),
        id: z.string(),
        invite: z
            .string()
            .url(),
    }),
    database: z.object({
        token: z.string(),
        url: z
            .string()
            .url(),
        connectionType: z.enum([
            "remote",
            "local-replica",
        ]),
    }),
});

export default envSchema.parse({
    env: process.env.NODE_ENV,
    discordBot: {
        token: process.env.DISCORD_BOT_TOKEN,
        id: process.env.DISCORD_BOT_ID,
        invite: process.env.DISCORD_BOT_INVITE,
    },
    database: {
        token: process.env.DATABASE_TOKEN,
        url: process.env.DATABASE_URL,
        connectionType: process.env.DATABASE_CONNECTION_TYPE,
    }
});