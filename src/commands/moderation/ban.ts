import { type CommandInteraction, SlashCommandBuilder, GuildMember, EmbedBuilder } from "discord.js";
import type { CommandType } from "../../types";
import { createDatabaseModerationAction } from "./+repositories";

export default {
    data: new SlashCommandBuilder()
        .setName("ban")
        .addUserOption(
            option => option
                .setName("member")
                .setDescription("The member to ban.")
                .setRequired(true)
        )
        .addStringOption(
            option => option
                .setName("reason")
                .setDescription("The reason for banning this member.")
        )
        .setDescription("Ban a member from the server."),
    run: async (interaction: CommandInteraction) => {
        await interaction.editReply("Banning...");
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
            await interaction.editReply("You cannot ban yourself.");

            return;
        };

        // won't work without this
        const guild = await interaction.guild.fetch();
        const member = await guild.members.fetch(data.memberId);

        if (member.user.bot) {
            await interaction.editReply("You cannot ban a bot.");

            return;
        };

        // or this because of caching reasons
        await guild.members.fetchMe();

        if (!member.bannable) {
            await interaction.editReply("You cannot ban this member.");

            return;
        };

        await member.ban({ reason: data.reason });

        const moderationAction = await createDatabaseModerationAction({
            memberId: data.memberId,
            userId: member.user.id,
            moderatorId: moderator.id,
            type: "ban",
            reason: data.reason,
        });

        await interaction.editReply({
            content: "Member has been banned.",
            embeds: [
                new EmbedBuilder()
                    .setColor("#9842f5")
                    .setThumbnail(member.avatarURL() || member.user.avatarURL())
                    .addFields([
                        {
                            name: "Member Banned",
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
                            value: `\`Ban\``,
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
            ],
        });
    },
} satisfies CommandType;