const { Events } = require('discord.js');

const interactionCreateHandler = async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        const responseMethod = interaction.replied || interaction.deferred ? 'followUp' : 'reply';
        await interaction[responseMethod]({ content: 'There was an error while executing this command!', ephemeral: true });
    }
    console.log(interaction);
};

module.exports = { interactionCreateHandler };
