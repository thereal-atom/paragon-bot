import { type CommandInteraction, SlashCommandBuilder } from "discord.js";
import type { CommandType } from "../../types";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("replies with pong"),
    run: async (interaction: CommandInteraction) => {
        await interaction.editReply("pong");
    },
} satisfies CommandType;