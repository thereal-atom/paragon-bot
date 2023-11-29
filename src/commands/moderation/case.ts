import { type CommandInteraction, SlashCommandBuilder, GuildMember, EmbedBuilder } from "discord.js";
import type { CommandType } from "../../types";
import { getDatabaseModerationAction } from "./+repositories";

export default {
    data: new SlashCommandBuilder()
        .setName("view-case")
        .addIntegerOption(
            option => option
                .setName("case-number")
                .setDescription("The number of the case to view.")
                .setRequired(true)
        )
        .setDescription("View the info of a case."),
    run: async (interaction: CommandInteraction) => {
        await interaction.editReply("Fetching Case...");
        if (!interaction.guild) return;

        const data = {
            caseNumber: interaction.options.get("case-number")?.value?.toString(),
        };

        if (!data.caseNumber) {
            await interaction.editReply("No case number was provided.");

            return;
        };

        const caseNumber = parseInt(data.caseNumber);

        const moderationAction = await getDatabaseModerationAction({ id: caseNumber });

        if (!moderationAction) {
            await interaction.editReply(`This case (\`${caseNumber}\`) does not exist.`);

            return;
        };

        await interaction.editReply({
            content: `Case \`${caseNumber}\`.`,
            embeds: [
                new EmbedBuilder()
                    .setColor("#9842f5")
                    .addFields([
                        {
                            name: "Member",
                            value: `<@${moderationAction.memberId}>`,
                            inline: true,
                        },
                        {
                            name: "Moderator",
                            value: `<@${moderationAction.moderatorId}>`,
                            inline: true,
                        },
                        {
                            name: "\u200B",
                            value: "\u200B",
                        },
                        {
                            name: "Case Id",
                            value: `\`${moderationAction.id}\``,
                            inline: true,
                        },
                        {
                            name: "Type",
                            value: `\`${moderationAction.type}\``,
                            inline: true,
                        },
                        {
                            name: "\u200B",
                            value: "\u200B",
                        },
                        {
                            name: "Reason",
                            value: moderationAction.reason || "No reason provided.",
                        },
                    ]),
            ]
        });
    },
} satisfies CommandType;