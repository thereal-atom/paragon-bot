import { Client, GatewayIntentBits, REST } from "discord.js";
import config from "../config";

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.login(config.discordBot.token);

export const rest = new REST().setToken(config.discordBot.token);