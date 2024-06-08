const { Events } = require('discord.js');

const readyHandler = (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
};

module.exports = { readyHandler };
