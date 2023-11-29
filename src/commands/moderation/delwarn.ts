import { type CommandInteraction, SlashCommandBuilder, GuildMember, EmbedBuilder } from "discord.js";
import type { CommandType } from "../../types";
import { createDatabaseModerationAction, deleteDatabaseModerationAction, getDatabaseModerationAction } from "./+repositories";

export default {
    data: new SlashCommandBuilder()
        .setName("delwarn")
        .addIntegerOption(
            option => option
                .setName("case-number")
                .setDescription("The case number of the warn to delete.")
                .setRequired(true)
        )
        .setDescription("Delete a warning."),
    run: async (interaction: CommandInteraction) => {
        await interaction.editReply("Deleting Warning...");
        if (!interaction.guild) return;

        const moderator = (interaction.member as GuildMember);

        const data = {
            caseNumber: interaction.options.get("case-number")?.value?.toString(),
        };

        if (!data.caseNumber) {
            await interaction.editReply("No member id was provided.");

            return;
        };

        const caseNumber = parseInt(data.caseNumber);

        const existingModerationAction = await getDatabaseModerationAction({ id: caseNumber });

        if (!existingModerationAction) {
            await interaction.editReply(`This case (\`${caseNumber}\`) does not exist.`);

            return;
        };

        if (existingModerationAction.type !== "warn") {
            await interaction.editReply(`This case (\`${caseNumber}\`) was not a warning.`);

            return;
        };

        await deleteDatabaseModerationAction({ id: caseNumber });

        const moderationAction = await createDatabaseModerationAction({
            memberId: existingModerationAction.memberId,
            userId: existingModerationAction.userId,
            moderatorId: moderator.id,
            type: "delwarn",
        });

        await interaction.editReply({
            content: "Warning was deleted.",
            embeds: [
                new EmbedBuilder()
                    .setColor("#9842f5")
                    .addFields([
                        {
                            name: "Moderator",
                            value: `<@${moderator.id}>`,
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
                            value: `\`Delete Warning\``,
                            inline: true,
                        },
                    ]),
            ]
        });
    },
} satisfies CommandType;