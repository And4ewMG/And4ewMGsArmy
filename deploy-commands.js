const { REST, Routes } = require('discord.js');
const { TOKEN, BOT_CLIENT_ID, BOT_GUILD_ID } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandItems = fs.readdirSync(foldersPath);

const loadCommands = (commandFiles, commandsPath = foldersPath) => {
    commandFiles.forEach((file) => {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if (command.data && command.execute) {
            commands.push(command.data.toJSON());
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

const rest = new REST().setToken(TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(Routes.applicationGuildCommands( BOT_CLIENT_ID, BOT_GUILD_ID ), { body: commands });

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();
