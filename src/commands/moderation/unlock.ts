import { type CommandInteraction, SlashCommandBuilder, GuildMember, EmbedBuilder, InteractionCollector, PermissionsBitField } from "discord.js";
import type { CommandType } from "../../types";
import { createDatabaseModerationAction } from "./+repositories";

export default {
    data: new SlashCommandBuilder()
        .setName("unlock")
        .addUserOption(
            option => option
                .setName("channel")
                .setDescription("The channel to unlock.")
        )
        .setDescription("Unlock a locked channel."),
    run: async (interaction: CommandInteraction) => {
        await interaction.editReply("Unlocking...");
        if (!interaction.guild) return;

        const moderator = (interaction.member as GuildMember);

        const data = {
            channelId: interaction.options.get("channelId")?.value?.toString() || interaction.channelId,
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
            type: "channel-unlock",
        });

        try {
            await channel.edit({
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        allow: [ PermissionsBitField.Flags.SendMessages ],
                    },
                ],
            });
        } catch (err) {
            console.error(err);

            interaction.channel?.send("Failed to unlock channel.");
        };

        await interaction.editReply({
            content: "Channel was unlocked.",
            embeds: [
                new EmbedBuilder()
                    .setColor("#9842f5")
                    .addFields([
                        {
                            name: "Channel Unlocked",
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
                            value: `\`Channel Unlock\``,
                            inline: true,
                        },
                    ]),
            ]
        });
    },
} satisfies CommandType;