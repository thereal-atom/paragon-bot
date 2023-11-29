import { type CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import type { CommandType } from "../../types";
import { getOrCreateDatabaseGuildConfig } from "./+repositories";

export default {
    data: new SlashCommandBuilder()
        .setName("view-config")
        .setDescription("View the configuration of the guild."),
    run: async (interaction: CommandInteraction) => {
        await interaction.editReply("Fetching Config...");
        if (!interaction.guild) return;
        
        const guildConfig = await getOrCreateDatabaseGuildConfig({ guildId: interaction.guild.id }, { guildId: interaction.guild.id });

        await interaction.editReply({
            content: "Guild Configuration.",
            embeds: [
                new EmbedBuilder()
                    .setColor("#e6db47")
                    .addFields([
                        {
                            name: "Muted Role",
                            value: guildConfig.mutedRoleId ? `<@&${guildConfig.mutedRoleId}>` : "Not Set",
                        },
                        {
                            name: "Moderator Role",
                            value: guildConfig.moderatorRoleId ? `<@&${guildConfig.moderatorRoleId}>` : "Not Set",
                        },
                        {
                            name: "Admin Role",
                            value: guildConfig.adminRoleId ? `<@&${guildConfig.adminRoleId}>` : "Not Set",
                        },
                    ]),
            ],
        });
    },
} satisfies CommandType;