const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const paranPgMappings = require('../utils/truthOrDareMappings/paran-mappings-pg.json');
const paranPg13Mappings = require('../utils/truthOrDareMappings/paran-mappings-pg13.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('paranoia')
        .setDescription('Request a Paranoia for Truth or Dare.')
        .addStringOption((option) =>
            option
                .setName('category')
                .setDescription("The category of question you're looking for.")
                .addChoices({ name: 'PG', value: 'pg' }, { name: 'PG13', value: 'pg13' })
                .setRequired(true),
        ),
    async execute(interaction) {
        let paranCategory = interaction.options.getString('category').toUpperCase();
        let paranTemp = Math.ceil(Math.random() * 250);
        let paranPgQuestion = paranPgMappings[paranTemp];
        let paranPg13Question = paranPg13Mappings[paranTemp];
        let paranQuestion = paranCategory === 'PG' ? paranPgQuestion : paranPg13Question;

        const paranEmbed = new EmbedBuilder()
            .setTitle(`🎯 ${paranQuestion}`)
            .setColor('#3971FF')
            .setDescription(`✍ Type: PARAN\n🤔 Question: ${paranCategory}#${paranTemp}`)
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        const paranPgButton = new ButtonBuilder()
            .setCustomId('paranpgbutton')
            .setLabel('PG')
            .setEmoji('👨‍👩‍👦')
            .setStyle(ButtonStyle.Primary);

        const paranPg13Button = new ButtonBuilder()
            .setCustomId('paranpg13button')
            .setLabel('PG13')
            .setEmoji('🥳')
            .setStyle(ButtonStyle.Secondary);

        const paranButtons = new ActionRowBuilder().addComponents(paranPgButton, paranPg13Button);

        await interaction.reply({ embeds: [paranEmbed], components: [paranButtons] });

        const filter = (i) => i.customId === 'paranpgbutton' || i.customId === 'paranpg13button';
        const paranCollector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        let timeout;

        const resetTimeout = () => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                interaction.editReply({ components: [] });
                paranCollector.stop();
            }, 60000);
        };

        paranCollector.on('collect', async (i) => {
            paranCategory = i.customId === 'paranpgbutton' ? 'PG' : 'PG13';

            paranTemp = Math.ceil(Math.random() * 250);
            paranPgQuestion = paranPgMappings[paranTemp];
            paranPg13Question = paranPg13Mappings[paranTemp];
            paranQuestion = paranCategory === 'PG' ? paranPgQuestion : paranPg13Question;

            const newParanEmbed = new EmbedBuilder()
                .setTitle(`🎯 ${paranQuestion}`)
                .setColor('#3971FF')
                .setDescription(`✍ Type: PARAN\n🤔 Question: ${paranCategory}#${paranTemp}`)
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            await i.update({ embeds: [newParanEmbed], components: [paranButtons] });

            resetTimeout();
        });

        resetTimeout();

        paranCollector.on('end', (collected) => {
            if (collected.size === 0) {
                interaction.editReply({ components: [] });
            }
        });
    },
};
