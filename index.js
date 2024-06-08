const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { TOKEN } = require('./config.json');

require('./deploy-commands');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandItems = fs.readdirSync(foldersPath);

const loadCommands = (commandFiles, commandsPath = foldersPath) => {
    commandFiles.forEach((file) => {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if (command.data && command.execute) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    });
};

if (commandItems.every((item) => fs.lstatSync(path.join(foldersPath, item)).isDirectory())) {
    commandItems.forEach((folder) => {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
        loadCommands(commandFiles, commandsPath);
    });
} else if (commandItems.every((item) => item.endsWith('.js'))) {
    loadCommands(commandItems);
} else {
    console.error('The commands directory should contain either only subdirectories or only files.');
}

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
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
});

client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(TOKEN);
