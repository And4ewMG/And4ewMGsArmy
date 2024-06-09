const {
    SlashCommandBuilder,
    PermissionsBitField,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a user from the server.')
        .addUserOption((option) => option.setName('user').setDescription('The user you would like to ban.').setRequired(true))
        .addStringOption((option) => option.setName('reason').setDescription('The reason for banning the user.')),

    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason') || 'No reason provided.';
            const member = await interaction.guild.members.fetch(user.id);

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                const banNoPerms = new EmbedBuilder()
                    .setTitle('⚠️ Action Prohibited: Insufficient Permissions.')
                    .setColor('#FF0000')
                    .setDescription(
                        'You do not have the required permissions to run this command.\n\nEvent: `/ban`\nRequired Permissions: `BAN_MEMBERS`',
                    );

                return await interaction.editReply({ embeds: [banNoPerms] });
            }

            if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                const botNoPerms = new EmbedBuilder()
                    .setTitle('⚠️ Action Prohibited: Bot Lacks Permissions')
                    .setColor('#FF0000')
                    .setDescription(
                        'The bot does not have the required permissions to ban members. Please check the bot’s role permissions.',
                    );
                return await interaction.editReply({ embeds: [botNoPerms] });
            }

            if (user.id === interaction.client.user.id) {
                const banMe = new EmbedBuilder()
                    .setTitle('⚠️ Action Prohibited: Bot Ban Attempt')
                    .setColor('#FF0000')
                    .setDescription(`The bot cannot be banned. Please select a different user.`);

                return await interaction.editReply({ embeds: [banMe] });
            }

            if (user.id === interaction.member.id) {
                const banSelf = new EmbedBuilder()
                    .setTitle('⚠️ Action Prohibited: Self-Ban')
                    .setColor('#FF0000')
                    .setDescription('You cannot ban yourself. Please select another user.');

                return await interaction.editReply({ embeds: [banSelf] });
            }

            if (user.id === interaction.guild.ownerId) {
                const banOwner = new EmbedBuilder()
                    .setTitle('⚠️ Action Prohibited: Owner Ban')
                    .setColor('#FF0000')
                    .setDescription('You cannot ban the owner. Please select a different user.');

                return await interaction.editReply({ embeds: [banOwner] });
            }

            if (interaction.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
                const banHigherRole = new EmbedBuilder()
                    .setTitle('⚠️ Action Prohibited: Higher Role')
                    .setColor('#FF0000')
                    .setDescription('You cannot ban a user with a higher or equal role than yourself.');

                return await interaction.editReply({ embeds: [banHigherRole] });
            }

            const banConfirm = new ButtonBuilder()
                .setCustomId('banconfirm')
                .setLabel('Confirm')
                .setEmoji('🛠️')
                .setStyle(ButtonStyle.Danger);

            const banCancel = new ButtonBuilder()
                .setCustomId('bancancel')
                .setLabel('Cancel')
                .setEmoji('❌')
                .setStyle(ButtonStyle.Secondary);

            const banButtons = new ActionRowBuilder().addComponents(banConfirm, banCancel);

            const banConfirmEmbed = new EmbedBuilder()
                .setTitle(`🛠️ Banning \`${user.tag}\``)
                .setColor('#3971FF')
                .setDescription(`Are you sure you would like to ban <@${user.id}>?\n\n📝 Reason: ${reason}`);

            await interaction.editReply({ embeds: [banConfirmEmbed], components: [banButtons] });

            const filter = (i) => i.user.id === interaction.user.id && ['banconfirm', 'bancancel'].includes(i.customId);
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async (i) => {
                if (i.customId === 'banconfirm') {
                    const banDmEmbed = new EmbedBuilder()
                        .setTitle(`🛠️ Banned from ${interaction.guild.name}`)
                        .setColor('#3971FF')
                        .setDescription(
                            `You were banned from ${interaction.guild.name}.\n\nReason: ${reason}.\nBanned by <@${interaction.user.id}>`,
                        );

                    try {
                        await user.send({ embeds: [banDmEmbed] });
                    } catch (dmError) {
                        console.error('Failed to send DM to the user:', dmError);
                    }

                    await member.ban({ reason });
                    const banSuccess = new EmbedBuilder()
                        .setTitle('✅ User Banned')
                        .setColor('#00FF00')
                        .setDescription(`<@${user.id}> has been banned.\n\n📝 Reason: ${reason}`);
                    await i.update({ embeds: [banSuccess], components: [], ephemeral: false });
                } else if (i.customId === 'bancancel') {
                    const banCancelEmbed = new EmbedBuilder()
                        .setTitle('❌ Ban Canceled')
                        .setColor('#FF0000')
                        .setDescription(`The ban action for <@${user.id}> has been canceled.`);
                    await i.update({ embeds: [banCancelEmbed], components: [] });
                }
                collector.stop();
            });

            collector.on('end', async (collected, reason) => {
                if (reason === 'time') {
                    const timeoutEmbed = new EmbedBuilder()
                        .setTitle('⌛ Action Timed Out')
                        .setColor('#FF0000')
                        .setDescription(`You did not respond in time. The ban action for <@${user.id}> has been canceled.`);
                    await interaction.editReply({ embeds: [timeoutEmbed], components: [] });
                }
            });
        } catch (error) {
            console.error('An error occurred while executing the ban command:', error);
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply({
                    content: 'An error occurred while executing the command. Please try again later.',
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: 'An error occurred while executing the command. Please try again later.',
                    ephemeral: true,
                });
            }
        }
    },
};
