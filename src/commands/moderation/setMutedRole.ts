import { type CommandInteraction, SlashCommandBuilder, GuildMember, EmbedBuilder } from "discord.js";
import type { CommandType } from "../../types";
import { createDatabaseGuildConfig, getDatabaseGuildConfig, updateDatabaseGuildConfig } from "./+repositories";

export default {
    data: new SlashCommandBuilder()
        .setName("set-muted-role")
        .addRoleOption(
            option => option
                .setName("role")
                .setDescription("The role to give muted members.")
                .setRequired(true)
        )
        .setDescription("Set a role to give muted members."),
    run: async (interaction: CommandInteraction) => {
        await interaction.editReply("Setting Muted Role...");
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
                mutedRoleId: data.roleId,
            });
        } else {
            await updateDatabaseGuildConfig(
                { guildId: interaction.guild.id },
                { mutedRoleId: data.roleId },
            );
        };

        await interaction.editReply({
            content: "Muted role was set.",
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