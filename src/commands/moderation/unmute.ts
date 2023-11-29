import { type CommandInteraction, SlashCommandBuilder, GuildMember, EmbedBuilder } from "discord.js";
import type { CommandType } from "../../types";
import { createDatabaseModerationAction, getDatabaseGuildConfig } from "./+repositories";

export default {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .addUserOption(
            option => option
                .setName("member")
                .setDescription("The member to unmute.")
                .setRequired(true)
        )
        .setDescription("Prevent a member from speaking."),
    run: async (interaction: CommandInteraction) => {
        await interaction.editReply("Muting...");
        if (!interaction.guild) return;

        const moderator = (interaction.member as GuildMember);

        const data = {
            memberId: interaction.options.get("member")?.value?.toString(),
        };

        if (!data.memberId) {
            await interaction.editReply("No member was provided.");

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

        if (!member.roles.cache.has(mutedRole.id)) {
            await interaction.editReply("Member is not muted.");

            return;
        };

        // or this because of caching reasons
        await guild.members.fetchMe();

        if (!member.moderatable) {
            await interaction.editReply("You cannot mute this member.");

            return;
        };

        await member.roles.remove(mutedRole);

        const moderationAction = await createDatabaseModerationAction({
            guildId: interaction.guild.id,
            memberId: data.memberId,
            userId: member.user.id,
            moderatorId: moderator.id,
            type: "unmute",
        });

        await interaction.editReply({
            content: "Member has been unmuted.",
            embeds: [
                new EmbedBuilder()
                    .setColor("#9842f5")
                    .setThumbnail(member.avatarURL() || member.user.avatarURL())
                    .addFields([
                        {
                            name: "Member Unmuted",
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
                            value: `\`Unmute\``,
                            inline: true,
                        },
                    ]),
            ],
        });
    },
} satisfies CommandType;