const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roles')
        .setDescription('Sendet das Self-Role Menü'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Self-Roles')
            .setColor('#9900ff')
            .setDescription(
                'Wähle hier deine gewünschten Benachrichtigungen aus, um Updates zu erhalten:\n\n' +
                '• **Ankündigungs-Ping**\n' +
                '• **Bewerbungs-Ping**\n' +
                '• **Event-Ping**\n' +
                '• **Kanal-Update-Ping**\n' +
                '• **YouTube-Ping (Video)**\n' +
                '• **YouTube-Ping (Stream)**\n' +
                '• **Twitch-Ping**'
            );

        const menu = new StringSelectMenuBuilder()
            .setCustomId('self_roles_menu')
            .setPlaceholder('Wähle EINE Rolle aus...')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                { label: 'Ankündigungs-Ping', value: '1478472971931619368' },
                { label: 'Bewerbungs-Ping', value: '1478473095814582362' },
                { label: 'Event-Ping', value: '1478473312685527071' },
                { label: 'Kanal-Update-Ping', value: '1478473869768786213' },
                { label: 'YouTube (Video)', value: '1478503454673731766' },
                { label: 'YouTube (Stream)', value: '1478503702410166393' },
                { label: 'Twitch-Ping', value: '1478503779862319135' }
            ]);

        const row = new ActionRowBuilder().addComponents(menu);

        await interaction.reply({ embeds: [embed], components: [row] });
    }
};