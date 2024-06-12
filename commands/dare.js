const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const darePgMappings = require('../utils/truthOrDareMappings/dare-mappings-pg.json');
const darePg13Mappings = require('../utils/truthOrDareMappings/dare-mappings-pg13.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dare')
        .setDescription('Request a Dare for Truth or Dare.')
        .addStringOption((option) =>
            option
                .setName('category')
                .setDescription("The category of dare you're looking for.")
                .addChoices({ name: 'PG', value: 'pg' }, { name: 'PG13', value: 'pg13' })
                .setRequired(true),
        ),
    async execute(interaction) {
        let dareCategory = interaction.options.getString('category').toUpperCase();
        let dareTemp = Math.ceil(Math.random() * 250);
        let dareQuestion;

        if (dareCategory === 'PG') {
            dareQuestion = darePgMappings[dareTemp];
        } else if (dareCategory === 'PG13') {
            dareQuestion = darePg13Mappings[dareTemp];
        }

        if (!dareQuestion) {
            await interaction.reply('Sorry, there was an error fetching the dare. Please try again.');
            return;
        }

        const dareEmbed = new EmbedBuilder()
            .setTitle(`🎯 ${dareQuestion}`)
            .setColor('#3971FF')
            .setDescription(`✍ Type: DARE\n🤔 Question: ${dareCategory}#${dareTemp}`)
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        const darePgButton = new ButtonBuilder()
            .setCustomId('darepgbutton')
            .setLabel('PG')
            .setEmoji('👨‍👩‍👦')
            .setStyle(ButtonStyle.Primary);

        const darePg13Button = new ButtonBuilder()
            .setCustomId('darepg13button')
            .setLabel('PG13')
            .setEmoji('🥳')
            .setStyle(ButtonStyle.Secondary);

        const dareButtons = new ActionRowBuilder().addComponents(darePgButton, darePg13Button);

        await interaction.reply({ embeds: [dareEmbed], components: [dareButtons] });

        const filter = (i) => i.customId === 'darepgbutton' || i.customId === 'darepg13button';
        const dareCollector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        let timeout;

        const resetTimeout = () => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                interaction.editReply({ components: [] });
                dareCollector.stop();
            }, 60000);
        };

        dareCollector.on('collect', async (i) => {
            dareCategory = i.customId === 'darepgbutton' ? 'PG' : 'PG13';

            dareTemp = Math.ceil(Math.random() * 250);
            if (dareCategory === 'PG') {
                dareQuestion = darePgMappings[dareTemp];
            } else if (dareCategory === 'PG13') {
                dareQuestion = darePg13Mappings[dareTemp];
            }

            if (!dareQuestion) {
                await i.reply('Sorry, there was an error fetching the dare. Please try again.');
                return;
            }

            const newDareEmbed = new EmbedBuilder()
                .setTitle(`🎯 ${dareQuestion}`)
                .setColor('#3971FF')
                .setDescription(`✍ Type: DARE\n🤔 Question: ${dareCategory}#${dareTemp}`)
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            await i.update({ embeds: [newDareEmbed], components: [dareButtons] });

            resetTimeout();
        });

        resetTimeout();

        dareCollector.on('end', (collected) => {
            if (collected.size === 0) {
                interaction.editReply({ components: [] });
            }
        });
    },
};
