import { Client, GatewayIntentBits } from "discord.js";
import config from "../config";

export const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
    ],
});

client.login(config.discordBot.token);