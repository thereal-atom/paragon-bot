import type { CommandType } from "../types";
import { Routes } from "discord.js"
import { rest } from "../client";
import config from "../config";

export const registerCommands = (commands: CommandType[]) => {
    const discordCommands = commands.map(({ data }) => data);

    if (config.env === "production") {
        rest
            .put(Routes.applicationCommands(config.discordBot.id), { body: discordCommands })
            .then(console.log)
            .catch(console.error);
    } else {
        rest
            .put(Routes.applicationGuildCommands(config.discordBot.id, config.discordBot.testServerId), { body: discordCommands })
            .then(console.log)
            .catch(console.error);
    };
};