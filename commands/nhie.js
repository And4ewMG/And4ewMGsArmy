const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const nhiePgMappings = require('../utils/truthOrDareMappings/nhie-mappings-pg.json');
const nhiePg13Mappings = require('../utils/truthOrDareMappings/nhie-mappings-pg13.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nhie')
        .setDescription('Request a Never Have I Ever question.')
        .addStringOption((option) =>
            option
                .setName('category')
                .setDescription("The category of question you're looking for.")
                .addChoices({ name: 'PG', value: 'pg' }, { name: 'PG13', value: 'pg13' })
                .setRequired(true),
        ),
    async execute(interaction) {
        let nhieCategory = interaction.options.getString('category').toUpperCase();
        let nhieTemp = Math.ceil(Math.random() * 250);
        let nhiePgQuestion = nhiePgMappings[nhieTemp];
        let nhiePg13Question = nhiePg13Mappings[nhieTemp];
        let nhieQuestion = nhieCategory === 'PG' ? nhiePgQuestion : nhiePg13Question;

        const nhieEmbed = new EmbedBuilder()
            .setTitle(`🎯 ${nhieQuestion}`)
            .setColor('#3971FF')
            .setDescription(`✍ Type: NHIE\n🤔 Question: ${nhieCategory}#${nhieTemp}`)
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        const nhiePgButton = new ButtonBuilder()
            .setCustomId('nhiepgbutton')
            .setLabel('PG')
            .setEmoji('👨‍👩‍👦')
            .setStyle(ButtonStyle.Primary);

        const nhiePg13Button = new ButtonBuilder()
            .setCustomId('nhiepg13button')
            .setLabel('PG13')
            .setEmoji('🥳')
            .setStyle(ButtonStyle.Secondary);

        const nhieButtons = new ActionRowBuilder().addComponents(nhiePgButton, nhiePg13Button);

        await interaction.reply({ embeds: [nhieEmbed], components: [nhieButtons] });

        const filter = (i) => i.customId === 'nhiepgbutton' || i.customId === 'nhiepg13button';
        const nhieCollector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        let timeout;

        const resetTimeout = () => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                interaction.editReply({ components: [] });
                nhieCollector.stop();
            }, 60000);
        };

        nhieCollector.on('collect', async (i) => {
            nhieCategory = i.customId === 'nhiepgbutton' ? 'PG' : 'PG13';

            nhieTemp = Math.ceil(Math.random() * 250);
            nhiePgQuestion = nhiePgMappings[nhieTemp];
            nhiePg13Question = nhiePg13Mappings[nhieTemp];
            nhieQuestion = nhieCategory === 'PG' ? nhiePgQuestion : nhiePg13Question;

            const newNhieEmbed = new EmbedBuilder()
                .setTitle(`🎯 ${nhieQuestion}`)
                .setColor('#3971FF')
                .setDescription(`✍ Type: NHIE\n🤔 Question: ${nhieCategory}#${nhieTemp}`)
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            await i.update({ embeds: [newNhieEmbed], components: [nhieButtons] });

            resetTimeout();
        });

        resetTimeout();

        nhieCollector.on('end', (collected) => {
            if (collected.size === 0) {
                interaction.editReply({ components: [] });
            }
        });
    },
};
