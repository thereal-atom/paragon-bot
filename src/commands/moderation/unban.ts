import { type CommandInteraction, SlashCommandBuilder, GuildMember, EmbedBuilder, Client } from "discord.js";
import type { CommandType } from "../../types";
import { createDatabaseModerationAction } from "./+repositories";

export default {
    data: new SlashCommandBuilder()
        .setName("unban")
        .addStringOption(
            option => option
                .setName("user-id")
                .setDescription("Id of the user to unban.")
                .setRequired(true)
        )
        .setDescription("Unban a member from the server."),
    run: async (interaction: CommandInteraction, client: Client) => {
        await interaction.editReply("Unbanning...");
        if (!interaction.guild) return;

        const moderator = (interaction.member as GuildMember);

        const data = {
            userId: interaction.options.get("user-id")?.value?.toString(),
        };

        if (!data.userId) {
            await interaction.editReply("No member id was provided.");

            return;
        };

        const user = await client.users.fetch(data.userId);

        await interaction.guild.members.unban(user);

        const moderationAction = await createDatabaseModerationAction({
            memberId: "",
            userId: user.id,
            moderatorId: moderator.id,
            type: "unban",
        });

        await interaction.editReply({
            content: "Member has been banned.",
            embeds: [
                new EmbedBuilder()
                    .setColor("#9842f5")
                    .setThumbnail(user.avatarURL())
                    .addFields([
                        {
                            name: "Member Unbanned",
                            value: `<@${user.id}>`,
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
                            value: `\`Unban\``,
                            inline: true,
                        },
                    ]),
            ],
        });
    },
} satisfies CommandType;