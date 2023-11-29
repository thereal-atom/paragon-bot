import { client } from "../client";
import { getDatabaseCustomCommand } from "../commands/custom/+repositories";

client.on("messageCreate", async message => {
    if (message.author.bot) {
        return;
    };

    if (!message.content.startsWith("$")) {
        return;
    };

    const commandName = message.content.replace("$", "");

    const command = await getDatabaseCustomCommand({ name: commandName });

    if (!command) {
        return;
    };

    if (command.guildId !== message.guildId) {
        return;
    };

    message.reply(command.response);
});