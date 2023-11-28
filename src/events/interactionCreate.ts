import { Events } from "discord.js";
import { client } from "../client";
import commands from "../commands";

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.find(command => command.data.name === interaction.commandName);
    if (!command) {
        await interaction.reply("command not found.");
        return;
    };

    await interaction.deferReply();

    try {
        await command.run(interaction);
    } catch (err: any) {
        console.error(err);

        await interaction.editReply(err.message || "An unknown error occurred");
    };
});