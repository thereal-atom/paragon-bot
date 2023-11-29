import { type CommandInteraction, SlashCommandBuilder, GuildMember, EmbedBuilder } from "discord.js";
import type { CommandType } from "../../types";
import { createDatabaseModerationAction, getDatabaseGuildConfig } from "./+repositories";

export default {
    data: new SlashCommandBuilder()
        .setName("mute")
        .addUserOption(
            option => option
                .setName("member")
                .setDescription("The member to mute.")
                .setRequired(true)
        )
        .addStringOption(
            option => option
                .setName("reason")
                .setDescription("The reason for muting this member.")
        )
        .setDescription("Prevent a member from speaking."),
    run: async (interaction: CommandInteraction) => {
        await interaction.editReply("Muting...");
        if (!interaction.guild) return;

        const moderator = (interaction.member as GuildMember);

        const data = {
            memberId: interaction.options.get("member")?.value?.toString(),
            reason: interaction.options.get("reason")?.value?.toString(),
        };

        if (!data.memberId) {
            await interaction.editReply("No member was provided.");

            return;
        };

        if (moderator.id === data.memberId) {
            await interaction.editReply("You cannot mute yourself.");

            return;
        };

        // won't work without this
        const guild = await interaction.guild.fetch();
        const member = await guild.members.fetch(data.memberId);

        const guildConfig = await getDatabaseGuildConfig({ guildId: interaction.guild.id });

        if (!guildConfig.mutedRoleId) {
            await interaction.editReply("Muted role not set. Use `/set-muted-role` to set the muted role.");

            return;
        };

        const mutedRole = await interaction.guild.roles.fetch(guildConfig.mutedRoleId);

        if (!mutedRole) {
            await interaction.editReply("Muted role does not exists. Create a role and use `/set-muted-role` to set the muted role.");

            return;
        };

        if (member.user.bot) {
            await interaction.editReply("You cannot mute a bot.");

            return;
        };

        // or this because of caching reasons
        await guild.members.fetchMe();

        if (!member.moderatable) {
            await interaction.editReply("You cannot mute this member.");

            return;
        };

        await member.roles.add(mutedRole);

        const moderationAction = await createDatabaseModerationAction({
            guildId: interaction.guild.id,
            memberId: data.memberId,
            userId: member.user.id,
            moderatorId: moderator.id,
            type: "mute",
            reason: data.reason,
        });

        await interaction.editReply({
            content: "Member has been muted.",
            embeds: [
                new EmbedBuilder()
                    .setColor("#9842f5")
                    .setThumbnail(member.avatarURL() || member.user.avatarURL())
                    .addFields([
                        {
                            name: "Member Muted",
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
                            value: `\`Mute\``,
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