const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('diceroll')
        .setDescription('Roll a dice!')
        .addIntegerOption((option) =>
            option.setName('sides').setDescription('The amount of sides the dice should have. Defaults to 6.'),
        ),
    async execute(interaction) {
        let sides = interaction.options.getInteger('sides');
        if (!sides) sides = 6;

        const diceNegativeEmbed = new EmbedBuilder()
            .setTitle('🎲 Error: Negative Number')
            .setColor('#FF0000')
            .setDescription('Please enter an integer greater than 3 in the sides input.');

        if (sides <= 3) {
            return await interaction.reply({ embeds: [diceNegativeEmbed], ephemeral: true });
        } else if (sides >= 2147483647) sides = 21487483647;

        let roll = Math.ceil(Math.random() * sides);

        const diceRollEmbed = new EmbedBuilder()
            .setTitle('🎲 Dice Roll')
            .setColor('#3971FF')
            .setDescription(`You rolled a **${roll}**!\n*Total sides: ${sides}*`)
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() });

        await interaction.reply({ embeds: [diceRollEmbed] });
    },
};
