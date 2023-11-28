import type { CommandInteraction, SlashCommandBuilder } from "discord.js";

export interface CommandType {
    data: SlashCommandBuilder;
    run: (interaction: CommandInteraction) => Promise<void>;
};