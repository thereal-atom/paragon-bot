import type { CommandType } from "../types";
import { REST, Routes } from "discord.js"
import config from "../config";

export const registerCommands = (commands: CommandType[]) => {
    const rest = new REST().setToken(config.discordBot.token);

    const discordCommands = commands.map(({ data }) => data);

    if (config.env === "production") {
        rest
            .put(Routes.applicationCommands(config.discordBot.id), { body: discordCommands })
            .then(console.log)
            .catch(console.error);
    } else {
        // test server id can be hard coded as it will only be edited in development
        rest
            .put(Routes.applicationGuildCommands(config.discordBot.id, "967845566505705543"), { body: discordCommands })
            .then(console.log)
            .catch(console.error);
    };
};