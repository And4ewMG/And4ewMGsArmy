const fs = require('node:fs');
const path = require('node:path');

const loadCommands = (commandFiles, commandsPath, commandCollection) => {
    commandFiles.forEach((file) => {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if (command.data && command.execute) {
            commandCollection.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    });
};

module.exports = { loadCommands };
