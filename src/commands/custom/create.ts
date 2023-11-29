import { type CommandInteraction, SlashCommandBuilder, EmbedBuilder, Routes } from "discord.js";
import type { CommandType } from "../../types";
import { createDatabaseCustomCommand, getDatabaseCustomCommand } from "./+repositories";

export default {
    data: new SlashCommandBuilder()
        .setName("create-command")
        .addStringOption(
            option => option
                .setName("name")
                .setDescription("Name of the custom command.")
                .setRequired(true)
        )
        .addStringOption(
            option => option
                .setName("response")
                .setDescription("What you want the response to the command to be.")
                .setRequired(true)
        )
        .setDescription("Create a custom command."),
    run: async (interaction: CommandInteraction) => {
        await interaction.editReply("Creating Command...");
        if (!interaction.guild) return;

        const data = {
            name: interaction.options.get("name")?.value?.toString(),
            response: interaction.options.get("response")?.value?.toString(),
        };

        if (!data.name || !data.response) {
            await interaction.editReply("No name/response was provided.");

            return;
        };

        const existingCommand = await getDatabaseCustomCommand({ name: data.name });

        if (existingCommand) {
            await interaction.editReply(`A command with this name (\`${data.name}\`) already exists.`);

            return;
        };

        const command = await createDatabaseCustomCommand({
            guildId: interaction.guild.id,
            creatorUserId: interaction.user.id,
            name: data.name,
            response: data.response,
        });

        await interaction.editReply({
            content: `Custom command was created. Use \`$${data.name}\` to run it.`,
            embeds: [
                new EmbedBuilder()
                    .setColor("#32a88d")
                    .addFields([
                        {
                            name: "Name",
                            value: command.name,
                            inline: true,
                        },
                        {
                            name: "Response",
                            value: command.response,
                            inline: true,
                        },
                        {
                            name: "\u200B",
                            value: "\u200B",
                        },
                        {
                            name: "Command Id",
                            value: `\`${command.id}\``,
                            inline: true,
                        },
                    ]),
            ],
        });
    },
} satisfies CommandType;