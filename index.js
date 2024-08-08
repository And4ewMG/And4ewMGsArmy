const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { BOT_TOKEN } = require('./config.json');
const loadEvents = require('./handlers/eventLoader');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
});

client.commands = new Collection();
loadEvents(client);

client.login(BOT_TOKEN);

module.exports = client;
