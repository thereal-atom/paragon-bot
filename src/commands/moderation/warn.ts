import { type CommandInteraction, SlashCommandBuilder, GuildMember, EmbedBuilder } from "discord.js";
import type { CommandType } from "../../types";
import { createDatabaseModerationAction } from "./+repositories";

export default {
    data: new SlashCommandBuilder()
        .setName("warn")
        .addUserOption(
            option => option
                .setName("member")
                .setDescription("The member to warn.")
                .setRequired(true)
        )
        .addStringOption(
            option => option
                .setName("reason")
                .setDescription("The reason for warning this member.")
                .setRequired(true)
        )
        .setDescription("Warn a member."),
    run: async (interaction: CommandInteraction) => {
        await interaction.editReply("Warning...");
        if (!interaction.guild) return;

        const moderator = (interaction.member as GuildMember);

        const data = {
            memberId: interaction.options.get("member")?.value?.toString(),
            reason: interaction.options.get("reason")?.value?.toString(),
        };

        if (!data.memberId) {
            await interaction.editReply("No member id was provided.");

            return;
        };

        if (moderator.id === data.memberId) {
            await interaction.editReply("You cannot warn yourself.");

            return;
        };

        const member = await interaction.guild.members.fetch(data.memberId);

        if (member.user.bot) {
            await interaction.editReply("You cannot warn a bot.");

            return;
        };

        const moderationAction = await createDatabaseModerationAction({
            guildId: interaction.guild.id,
            memberId: data.memberId,
            userId: member.user.id,
            moderatorId: moderator.id,
            type: "warn",
            reason: data.reason,
        });

        try {
            await member.send(`You have been warned (in server: ${interaction.guildId}) for: \`${data.reason}\``);
        } catch (err) {
            console.error(err);

            interaction.channel?.send("Failed to DM user.");
        };

        await interaction.editReply({
            content: "Member has been warned.",
            embeds: [
                new EmbedBuilder()
                    .setColor("#9842f5")
                    .setThumbnail(member.avatarURL() || member.user.avatarURL())
                    .addFields([
                        {
                            name: "Member Warned",
                            value: `<@${data.memberId}>`,
                            inline: true,
                        },
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
                            value: `\`Warning\``,
                            inline: true,
                        },
                        {
                            name: "\u200B",
                            value: "\u200B",
                        },
                        {
                            name: "Reason",
                            value: data.reason || "No reason provided.",
                        },
                    ]),
            ]
        });
    },
} satisfies CommandType;