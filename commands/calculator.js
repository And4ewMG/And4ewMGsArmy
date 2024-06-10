const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const math = require('mathjs'); // npm i mathjs

module.exports = {
    data: new SlashCommandBuilder().setName('calculator').setDescription('Opens up a calculator for you to use.'),
    async execute(interaction) {
        const calculatorEmbed = new EmbedBuilder()
            .setColor('#3971FF')
            .setDescription('```\nResults will be displayed here.\n```');

        const calculatorRow0 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('AC').setCustomId('calc_clear').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setLabel('<<').setCustomId('calc_backspace').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setLabel('(').setCustomId('calc_(').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setLabel(')').setCustomId('calc_)').setStyle(ButtonStyle.Primary),
        );

        const calculatorRow1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('1').setCustomId('calc_1').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setLabel('2').setCustomId('calc_2').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setLabel('3').setCustomId('calc_3').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setLabel('/').setCustomId('calc_/').setStyle(ButtonStyle.Primary),
        );

        const calculatorRow2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('4').setCustomId('calc_4').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setLabel('5').setCustomId('calc_5').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setLabel('6').setCustomId('calc_6').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setLabel('*').setCustomId('calc_*').setStyle(ButtonStyle.Primary),
        );

        const calculatorRow3 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('7').setCustomId('calc_7').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setLabel('8').setCustomId('calc_8').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setLabel('9').setCustomId('calc_9').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setLabel('-').setCustomId('calc_-').setStyle(ButtonStyle.Primary),
        );

        const calculatorRow4 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('=').setCustomId('calc_=').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setLabel('0').setCustomId('calc_0').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setLabel('.').setCustomId('calc_.').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setLabel('+').setCustomId('calc_+').setStyle(ButtonStyle.Primary),
        );

        const calcMessage = await interaction.reply({
            embeds: [calculatorEmbed],
            components: [calculatorRow0, calculatorRow1, calculatorRow2, calculatorRow3, calculatorRow4],
            ephemeral: false,
        });

        let calculatorData = '';
        const calculatorCollector = calcMessage.createMessageComponentCollector({
            filter: (i) => i.user.id === interaction.user.id,
            time: 600000,
        });

        calculatorCollector.on('collect', async (i) => {
            let id = i.customId;
            let value = id.split('_')[1];
            let extra = '';

            if (value === '=') {
                try {
                    calculatorData = math.evaluate(calculatorData).toString();
                } catch (error) {
                    calculatorData = '';
                    extra = 'An error occurred, please click AC to restart.';
                }
            } else if (value === 'clear') {
                calculatorData = '';
                extra = 'Results will be displayed here.';
            } else if (value === 'backspace') {
                calculatorData = calculatorData.slice(0, -1);
            } else {
                calculatorData += value;
            }

            await i.update({
                embeds: [new EmbedBuilder().setColor('#3971FF').setDescription(`\`\`\`\n${calculatorData || extra}\n\`\`\``)],
                components: [calculatorRow0, calculatorRow1, calculatorRow2, calculatorRow3, calculatorRow4],
                ephemeral: false,
            });
        });
    },
};
