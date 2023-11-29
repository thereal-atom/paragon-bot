import { type CommandInteraction, SlashCommandBuilder, EmbedBuilder, Routes } from "discord.js";
import type { CommandType } from "../../types";
import { deleteDatabaseCustomCommand, getDatabaseCustomCommand } from "./+repositories";

export default {
    data: new SlashCommandBuilder()
        .setName("delete-command")
        .addStringOption(
            option => option
                .setName("name")
                .setDescription("Name of the custom command.")
                .setRequired(true)
        )
        .setDescription("Delete a custom command."),
    run: async (interaction: CommandInteraction) => {
        await interaction.editReply("Deleting Command...");
        if (!interaction.guild) return;

        const data = {
            name: interaction.options.get("name")?.value?.toString(),
        };

        if (!data.name) {
            await interaction.editReply("No name was provided.");

            return;
        };

        const existingCommand = await getDatabaseCustomCommand({ name: data.name });

        if (!existingCommand) {
            await interaction.editReply(`No custom command with this name (\`${data.name}\`) exists.`);

            return;
        };

        await deleteDatabaseCustomCommand({ name: data.name });
        await interaction.editReply({ content: `Custom command was deleted.` });
    },
} satisfies CommandType;