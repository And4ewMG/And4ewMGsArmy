const { Events } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Handling slash commands
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName); // Accessing commands correctly
            if (!command) return;
            
            try {
                // Execute the command
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        } 
    }
};
