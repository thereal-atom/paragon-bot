import type { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";

export interface CommandType {
    data: SlashCommandBuilder;
    run: (interaction: CommandInteraction, client: Client) => Promise<void>;
};