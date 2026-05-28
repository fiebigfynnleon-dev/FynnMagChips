const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('support-panel')
        .setDescription('Erstellt das Support-Raum Auswahlpanel'),
    async execute(interaction) {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('support_1478540189449322526').setLabel('Support 1').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('support_1478540500985446562').setLabel('Support 2').setStyle(ButtonStyle.Success)
            // Füge hier deine weiteren Support-Kanal-IDs hinzu
        );
        await interaction.reply({ content: 'Wähle einen freien Support-Raum:', components: [row] });
    }
};