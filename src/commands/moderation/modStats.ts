import { type CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import type { CommandType } from "../../types";
import { countModerationActions } from "./+repositories";

export default {
    data: new SlashCommandBuilder()
        .setName("mod-stats")
        .addUserOption(
            option => option
                .setName("moderator")
                .setDescription("The moderator who's stats to view.")
                .setRequired(true)
        )
        .setDescription("View a moderator's statistics."),
    run: async (interaction: CommandInteraction) => {
        await interaction.editReply("Fetching Stats...");
        if (!interaction.guild) return;

        const data = {
            moderatorId: interaction.options.get("moderator")?.value?.toString(),
        };

        if (!data.moderatorId) {
            await interaction.editReply("No moderator was provided.");

            return;
        };

        const moderationActionCount = await countModerationActions({ moderatorId: data.moderatorId });

        await interaction.editReply({
            content: `Stats for <@${data.moderatorId}>`,
            embeds: [
                new EmbedBuilder()
                    .setColor("#9842f5")
                    .addFields([
                        {
                            name: "Moderator",
                            value: `<@${data.moderatorId}>`,
                            inline: true,
                        },
                        {
                            name: "Moderations",
                            value: `\`${moderationActionCount}\``,
                            inline: true,
                        },
                    ]),
            ]
        });
    },
} satisfies CommandType;