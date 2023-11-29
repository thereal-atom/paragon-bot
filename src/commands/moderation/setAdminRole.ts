import { type CommandInteraction, SlashCommandBuilder, GuildMember, EmbedBuilder } from "discord.js";
import type { CommandType } from "../../types";
import { createDatabaseGuildConfig, getDatabaseGuildConfig, updateDatabaseGuildConfig } from "./+repositories";

export default {
    data: new SlashCommandBuilder()
        .setName("set-admin-role")
        .addRoleOption(
            option => option
                .setName("role")
                .setDescription("The role that admins in your server have.")
                .setRequired(true)
        )
        .setDescription("Set a role that admins in your server have."),
    run: async (interaction: CommandInteraction) => {
        await interaction.editReply("Setting Admin Role...");
        if (!interaction.guild) return;

        const moderator = (interaction.member as GuildMember);

        const data = {
            roleId: interaction.options.get("role")?.value?.toString(),
        };

        if (!data.roleId) {
            await interaction.editReply("No role was provided.");

            return;
        };
        
        const guildConfig = await getDatabaseGuildConfig({ guildId: interaction.guild.id });

        if (!guildConfig) {
            await createDatabaseGuildConfig({
                guildId: interaction.guild.id,
                adminRoleId: data.roleId,
            });
        } else {
            await updateDatabaseGuildConfig(
                { guildId: interaction.guild.id },
                { adminRoleId: data.roleId },
            );
        };

        await interaction.editReply({
            content: "Admin role was set.",
            embeds: [
                new EmbedBuilder()
                    .setColor("#e6db47")
                    .addFields([
                        {
                            name: "Role Set",
                            value: `<@&${data.roleId}>`,
                            inline: true,
                        },
                        {
                            name: "Moderator",
                            value: `<@${moderator.id}>`,
                            inline: true,
                        },
                    ]),
            ]
        });
    },
} satisfies CommandType;