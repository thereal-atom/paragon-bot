declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DISCORD_BOT_ID: string;
            DISCORD_BOT_TOKEN: string;
            DISCORD_BOT_INVITE: string;
            DATABASE_URL: string;
            DATABASE_TOKEN: string;
            DATABASE_CONNECTION_TYPE: "remote" | "local-replica";
        }
    }
}

export {};