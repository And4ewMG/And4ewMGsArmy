const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const truthPgMappings = require('../utils/truthOrDareMappings/truth-mappings-pg.json'); // Deleting this file may cause this command to break
const truthPg13Mappings = require('../utils/truthOrDareMappings/truth-mappings-pg13.json'); // Deleting this file may cause this command to break

module.exports = {
    data: new SlashCommandBuilder()
        .setName('truth')
        .setDescription('Request a Truth for Truth or Dare.')
        .addStringOption((option) =>
            option
                .setName('category')
                .setDescription("The category of question you're looking for.")
                .addChoices({ name: 'PG', value: 'pg' }, { name: 'PG13', value: 'pg13' })
                .setRequired(true),
        ),
    async execute(interaction) {
        let truthCategory = interaction.options.getString('category').toUpperCase();
        let truthTemp = Math.ceil(Math.random() * 250);
        let truthPgQuestion = truthPgMappings[truthTemp];
        let truthPg13Question = truthPg13Mappings[truthTemp];
        let truthQuestion = truthCategory === 'PG' ? truthPgQuestion : truthPg13Question;

        const truthEmbed = new EmbedBuilder()
            .setTitle(`🎯 ${truthQuestion}`)
            .setColor('#3971FF')
            .setDescription(`✍ Type: TRUTH\n🤔 Question: ${truthCategory}#${truthTemp}`)
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        const truthPgButton = new ButtonBuilder()
            .setCustomId('truthpgbutton')
            .setLabel('PG')
            .setEmoji('👨‍👩‍👦')
            .setStyle(ButtonStyle.Primary);

        const truthPg13Button = new ButtonBuilder()
            .setCustomId('truthpg13button')
            .setLabel('PG13')
            .setEmoji('🥳')
            .setStyle(ButtonStyle.Secondary);

        const truthButtons = new ActionRowBuilder().addComponents(truthPgButton, truthPg13Button);

        await interaction.reply({ embeds: [truthEmbed], components: [truthButtons] });

        const filter = (i) => i.customId === 'truthpgbutton' || i.customId === 'truthpg13button';
        const truthCollector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        let timeout;

        const resetTimeout = () => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                interaction.editReply({ components: [] });
                truthCollector.stop();
            }, 60000);
        };

        truthCollector.on('collect', async (i) => {
            truthCategory = i.customId === 'truthpgbutton' ? 'PG' : 'PG13';

            truthTemp = Math.ceil(Math.random() * 250);
            truthPgQuestion = truthPgMappings[truthTemp];
            truthPg13Question = truthPg13Mappings[truthTemp];
            truthQuestion = truthCategory === 'PG' ? truthPgQuestion : truthPg13Question;

            const newTruthEmbed = new EmbedBuilder()
                .setTitle(`🎯 ${truthQuestion}`)
                .setColor('#3971FF')
                .setDescription(`✍ Type: TRUTH\n🤔 Question: ${truthCategory}#${truthTemp}`)
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            await i.update({ embeds: [newTruthEmbed], components: [truthButtons] });

            resetTimeout();
        });

        resetTimeout();

        truthCollector.on('end', (collected) => {
            if (collected.size === 0) {
                interaction.editReply({ components: [] });
            }
        });
    },
};
