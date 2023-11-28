import { Client } from "discord.js";
import config from "../config";

export const client = new Client({
    intents: [],
});

client.login(config.discordBot.token);