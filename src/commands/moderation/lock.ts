import { type CommandInteraction, SlashCommandBuilder, GuildMember, EmbedBuilder, InteractionCollector, PermissionsBitField } from "discord.js";
import type { CommandType } from "../../types";
import { createDatabaseModerationAction } from "./+repositories";

export default {
    data: new SlashCommandBuilder()
        .setName("lock")
        .addUserOption(
            option => option
                .setName("channel")
                .setDescription("The channel to lock.")
        )
        .addStringOption(
            option => option
                .setName("reason")
                .setDescription("The reason for locking this channel.")
        )
        .setDescription("Prevent users from messaging in a channel."),
    run: async (interaction: CommandInteraction) => {
        await interaction.editReply("Locking...");
        if (!interaction.guild) return;

        const moderator = (interaction.member as GuildMember);

        const data = {
            channelId: interaction.options.get("channelId")?.value?.toString() || interaction.channelId,
            reason: interaction.options.get("reason")?.value?.toString(),
        };
        
        const channel = await interaction.guild.channels.fetch(data.channelId);

        if (!channel) {
            await interaction.editReply("Channel doesn't exist.");

            return;
        };

        const moderationAction = await createDatabaseModerationAction({
            guildId: interaction.guild.id,
            channelId: data.channelId,
            moderatorId: moderator.id,
            type: "channel-lock",
            reason: data.reason,
        });

        try {
            await channel.edit({
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [ PermissionsBitField.Flags.SendMessages ],
                    },
                ],
            });
        } catch (err) {
            console.error(err);

            interaction.channel?.send("Failed to lock channel.");
        };

        await interaction.editReply({
            content: `Channel was locked.\n\nReason: ${data.reason || "No reason provided."}`,
            embeds: [
                new EmbedBuilder()
                    .setColor("#9842f5")
                    .addFields([
                        {
                            name: "Channel Locked",
                            value: `<#${data.channelId}>`,
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
                            value: `\`Channel Lock\``,
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