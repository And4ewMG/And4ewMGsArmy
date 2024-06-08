const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { TOKEN } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const { loadCommands } = require('./utils/loadCommands');
const { interactionCreateHandler } = require('./events/interactionCreate');
const { readyHandler } = require('./events/ready');

require('./deploy-commands');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandItems = fs.readdirSync(foldersPath);

loadCommands(commandItems, foldersPath, client.commands);

if (commandItems.every((item) => fs.lstatSync(path.join(foldersPath, item)).isDirectory())) {
    commandItems.forEach((folder) => {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
        loadCommands(commandFiles, commandsPath, client.commands);
    });
} else if (commandItems.every((item) => item.endsWith('.js'))) {
    const commandsPath = path.join(__dirname, 'commands');
    loadCommands(commandItems, commandsPath, client.commands);
} else {
    console.error('The commands directory should contain either only subdirectories or only files.');
}

client.on(Events.InteractionCreate, interactionCreateHandler);
client.once(Events.ClientReady, readyHandler);

client.login(TOKEN);
