const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const wyrPgMappings = require('../utils/truthOrDareMappings/wyr-mappings-pg.json');
const wyrPg13Mappings = require('../utils/truthOrDareMappings/wyr-mappings-pg13.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wyr')
        .setDescription('Request a Would You Rather for Truth or Dare.')
        .addStringOption((option) =>
            option
                .setName('category')
                .setDescription("The category of question you're looking for.")
                .addChoices({ name: 'PG', value: 'pg' }, { name: 'PG13', value: 'pg13' })
                .setRequired(true),
        ),
    async execute(interaction) {
        let wyrCategory = interaction.options.getString('category').toUpperCase();
        let wyrTemp = Math.ceil(Math.random() * 250);
        let wyrPgQuestion = wyrPgMappings[wyrTemp];
        let wyrPg13Question = wyrPg13Mappings[wyrTemp];
        let wyrQuestion = wyrCategory === 'PG' ? wyrPgQuestion : wyrPg13Question;

        const wyrEmbed = new EmbedBuilder()
            .setTitle(`🎯 ${wyrQuestion}`)
            .setColor('#3971FF')
            .setDescription(`✍ Type: WYR\n🤔 Question: ${wyrCategory}#${wyrTemp}`)
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        const wyrPgButton = new ButtonBuilder()
            .setCustomId('wyrpgbutton')
            .setLabel('PG')
            .setEmoji('👨‍👩‍👦')
            .setStyle(ButtonStyle.Primary);

        const wyrPg13Button = new ButtonBuilder()
            .setCustomId('wyrpg13button')
            .setLabel('PG13')
            .setEmoji('🥳')
            .setStyle(ButtonStyle.Secondary);

        const wyrButtons = new ActionRowBuilder().addComponents(wyrPgButton, wyrPg13Button);

        await interaction.reply({ embeds: [wyrEmbed], components: [wyrButtons] });

        const filter = (i) => i.customId === 'wyrpgbutton' || i.customId === 'wyrpg13button';
        const wyrCollector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        let timeout;

        const resetTimeout = () => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                interaction.editReply({ components: [] });
                wyrCollector.stop();
            }, 60000);
        };

        wyrCollector.on('collect', async (i) => {
            wyrCategory = i.customId === 'wyrpgbutton' ? 'PG' : 'PG13';

            wyrTemp = Math.ceil(Math.random() * 250);
            wyrPgQuestion = wyrPgMappings[wyrTemp];
            wyrPg13Question = wyrPg13Mappings[wyrTemp];
            wyrQuestion = wyrCategory === 'PG' ? wyrPgQuestion : wyrPg13Question;

            const newWyrEmbed = new EmbedBuilder()
                .setTitle(`🎯 ${wyrQuestion}`)
                .setColor('#3971FF')
                .setDescription(`✍ Type: WYR\n🤔 Question: ${wyrCategory}#${wyrTemp}`)
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            await i.update({ embeds: [newWyrEmbed], components: [wyrButtons] });

            resetTimeout();
        });

        resetTimeout();

        wyrCollector.on('end', (collected) => {
            if (collected.size === 0) {
                interaction.editReply({ components: [] });
            }
        });
    },
};
