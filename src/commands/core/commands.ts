import { type CommandInteraction, SlashCommandBuilder } from "discord.js";
import type { CommandType } from "../../types";

export default {
    data: new SlashCommandBuilder()
        .setName("view-commands")
        .setDescription("View a list of existing commands."),
    run: async (interaction: CommandInteraction) => {
        if (!interaction.guild) return;

        const slashCommands = await interaction.guild.commands.fetch();

        const commands = slashCommands.map(command => {
            return `\`/${command.name}\` - ${command.description}`;
            
            // {
            //     name: command.name,
            //     description: command.description,
            //     options: command.options.map(option => {
            //         return {
            //             name: option.name,
            //             description: option.description,
            //             type: option.type,
            //         };
            //     }),
            // };
        })

        await interaction.editReply("List of commands:\n\n" + commands.join("\n"));
    },
} satisfies CommandType;