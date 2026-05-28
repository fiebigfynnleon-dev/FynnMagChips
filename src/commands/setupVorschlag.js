const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-vorschlag')
        .setDescription('Erstellt das Info-Embed für Vorschläge')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const embed = new EmbedBuilder()
            .setColor('#1E2A38')
            .setTitle('Vorschläge 💡')
            .setDescription(
                'Hast du eine Idee, die unseren Server besser machen kann?\n' +
                'Dann bist du hier genau richtig!\n\n' +
                '🚀 **Teile deinen Vorschlag mit uns** und hilf aktiv dabei, die Community weiterzuentwickeln.\n' +
                '💭 Egal ob neue Regeln, Verbesserungen oder Anpassungen – jede durchdachte Idee zählt.\n\n' +
                'Damit dein Vorschlag die besten Chancen hat, achte bitte auf Folgendes:\n\n' +
                '• Erkläre genau, was geändert oder hinzugefügt werden soll\n' +
                '• Nenne den Mehrwert für den Server oder die Spieler\n' +
                '• Bleib respektvoll und sachlich\n\n' +
                '⚠️ Unklare, sehr kurze oder sinnlose Vorschläge können abgelehnt werden.\n' +
                '⛔ Troll- oder Spam-Vorschläge werden nicht beachtet, ggf. gelöscht und können zu Sanktionen führen.\n\n' +
                '👉 **Klicke unten auf den Button**, um deinen Vorschlag zu erstellen und Teil der Entwicklung zu werden!'
            );

        const button = new ButtonBuilder()
            .setCustomId('btn_vorschlag_start')
            .setLabel('Vorschlag erstellen')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        await interaction.channel.send({ embeds: [embed], components: [row] });
        await interaction.editReply({ content: '✅ Info-Embed wurde erstellt!' });
    },
};