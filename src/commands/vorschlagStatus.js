const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// ROLLEN-ID DER LEITUNGSEBENE
const LEITUNG_ROLLE_ID = '1478383487852478587';
// DER KANAL WO DIE VORSCHLÄGE LIEGEN
const VORSCHLAG_ZIEL_KANAL_ID = '1508221606164693132'; // Falls Zahlendreher: Überprüfe diese ID mit deiner Kanal-ID!

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vorschlag-status')
        .setDescription('Ändert den Status eines eingereichten Vorschlags')
        .addStringOption(option =>
            option.setName('nachrichten_id')
                .setDescription('Die ID der Nachricht des Vorschlags (Rechtsklick auf die Embed-Nachricht -> ID kopieren)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('status')
                .setDescription('Wähle den neuen Status')
                .setRequired(true)
                .addChoices(
                    { name: '🟢 Angenommen', value: 'angenommen' },
                    { name: '🟡 Berücksichtigt', value: 'beruecksichtigt' },
                    { name: '🔵 Beim nächsten TB dabei', value: 'tb' },
                    { name: '🔴 Abgelehnt', value: 'abgelehnt' }
                ))
        .addStringOption(option =>
            option.setName('grund')
                .setDescription('Der Grund für diese Entscheidung (Bei TB optional)')
                .setRequired(false)),

    async execute(interaction) {
        // 1. Rollen-Prüfung: Hat der User die Leitungs-Rolle?
        if (!interaction.member.roles.cache.has(LEITUNG_ROLLE_ID)) {
            return await interaction.reply({
                content: '❌ **Zugriff verweigert!** Dieser Befehl darf nur von der Leitungsebene ausgeführt werden.',
                ephemeral: true
            });
        }

        const msgId = interaction.options.getString('nachrichten_id');
        const status = interaction.options.getString('status');
        const grund = interaction.options.getString('grund');

        // 2. Pflicht-Prüfung für den Grund (Bei Angenommen, Berücksichtigt, Abgelehnt zwingend nötig)
        if (status !== 'tb' && !grund) {
            return await interaction.reply({
                content: '⚠️ **Fehler:** Für diesen Status *musst* du einen Grund angeben!',
                ephemeral: true
            });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            // Kanal holen und Nachricht suchen
            const kanal = await interaction.client.channels.fetch(VORSCHLAG_ZIEL_KANAL_ID);
            const nachricht = await kanal.messages.fetch(msgId);

            // Prüfen, ob die Nachricht ein Embed vom Bot hat
            if (!nachricht.embeds || nachricht.embeds.length === 0) {
                return await interaction.editReply({ content: '❌ Unter dieser ID wurde kein gültiger Vorschlag gefunden.' });
            }

            // Das alte Embed kopieren, um es zu bearbeiten
            const altesEmbed = nachricht.embeds[0];
            const neuesEmbed = EmbedBuilder.from(altesEmbed);

            // Standardwerte für Farbe und Text vorbereiten
            let statusText = '';
            let statusFarbe = '#ffffff';

            switch (status) {
                case 'angenommen':
                    statusText = '🟢 Angenommen';
                    statusFarbe = '#2ECC71'; // Grün
                    break;
                case 'beruecksichtigt':
                    statusText = '🟡 Berücksichtigt';
                    statusFarbe = '#F1C40F'; // Gelb
                    break;
                case 'tb':
                    statusText = '🔵 Wird beim nächsten TB dabei sein';
                    statusFarbe = '#3498DB'; // Blau
                    break;
                case 'abgelehnt':
                    statusText = '🔴 Abgelehnt';
                    statusFarbe = '#E74C3C'; // Rot
                    break;
            }

            // Die Felder im Embed updaten
            // Wir filtern das alte Status-Feld heraus und setzen es neu
            const gefilterteFelder = altesEmbed.fields.filter(f => f.name !== 'Status' && f.name !== 'Grund');
            
            neuesEmbed.setFields(gefilterteFelder);
            neuesEmbed.addFields({ name: 'Status', value: statusText, inline: true });
            neuesEmbed.setColor(statusFarbe);

            // Wenn ein Grund angegeben wurde, fügen wir ihn als Feld hinzu
            if (grund) {
                neuesEmbed.addFields({ name: 'Grund', value: grund, inline: false });
            }

            // Das bearbeitete Embed zurück in die originale Nachricht speichern
            await nachricht.edit({ embeds: [neuesEmbed] });

            await interaction.editReply({ content: `✅ Der Status des Vorschlags wurde erfolgreich auf **${statusText}** aktualisiert!` });

        } catch (error) {
            console.error('Fehler beim Aktualisieren des Vorschlags:', error);
            await interaction.editReply({ content: '❌ Fehler beim Bearbeiten des Vorschlags. Stelle sicher, dass die Nachrichten-ID stimmt.' });
        }
    },
};