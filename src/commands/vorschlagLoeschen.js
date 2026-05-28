const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const LEITUNG_ROLLE_ID = '1478383487852478587';
const VORSCHLAG_ZIEL_KANAL_ID = '1508221606164693132';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vorschlag-loeschen')
        .setDescription('Löscht einen Vorschlag und den Diskussionsthread anhand der ID-Nummer')
        .addIntegerOption(option =>
            option.setName('id_nummer')
                .setDescription('Die reine Nummer des Vorschlags (z.B. 5 bei Vorschlag #5)')
                .setRequired(true)),

    async execute(interaction) {
        // Rollen-Prüfung für die Leitungsebene
        if (!interaction.member.roles.cache.has(LEITUNG_ROLLE_ID)) {
            return await interaction.reply({
                content: '❌ **Zugriff verweigert!** Dieser Befehl darf nur von der Leitungsebene ausgeführt werden.',
                ephemeral: true
            });
        }

        const suchId = interaction.options.getInteger('id_nummer');
        await interaction.deferReply({ ephemeral: true });

        try {
            const kanal = await interaction.client.channels.fetch(VORSCHLAG_ZIEL_KANAL_ID);
            
            // Die letzten 100 Nachrichten holen, um das Embed zu suchen
            const nachrichten = await kanal.messages.fetch({ limit: 100 });
            let gefundeneNachricht = null;

            for (const msg of nachrichten.values()) {
                if (msg.embeds && msg.embeds.length > 0) {
                    const idFeld = msg.embeds[0].fields.find(f => f.name === 'ID');
                    if (idFeld && idFeld.value === `#${suchId}`) {
                        gefundeneNachricht = msg;
                        break;
                    }
                }
            }

            if (!gefundeneNachricht) {
                return await interaction.editReply({ 
                    content: `❌ Es wurde kein Vorschlag mit der ID **#${suchId}** unter den letzten 100 Nachrichten gefunden.` 
                });
            }

            let threadGeloeschtInfo = '';

            // NEU: Prüfen, ob an der Nachricht ein aktiver oder archivierter Thread hängt
            if (gefundeneNachricht.thread) {
                try {
                    await gefundeneNachricht.thread.delete();
                    threadGeloeschtInfo = ' und der Diskussionsthread';
                } catch (threadError) {
                    console.error('Konnte Thread nicht direkt über die Nachricht löschen, versuche Kanalsuche...', threadError);
                }
            } else {
                // Sicherheitsnetz: Falls Discord den Thread nicht direkt an der Nachricht mitsendet,
                // suchen wir kurz im Kanal nach aktiven Threads, die so heißen
                const aktiveThreads = await kanal.threads.fetchActive();
                const passenderThread = aktiveThreads.threads.find(t => t.name.includes(`#${suchId}`));
                
                if (passenderThread) {
                    await passenderThread.delete();
                    threadGeloeschtInfo = ' und der Diskussionsthread';
                }
            }

            // Jetzt die Hauptnachricht (das Embed) löschen
            await gefundeneNachricht.delete();

            await interaction.editReply({ 
                content: `🗑️ Der Vorschlag **#${suchId}**${threadGeloeschtInfo} wurden erfolgreich und permanent gelöscht!` 
            });
            
            console.log(`⚠️ Vorschlag #${suchId} und Thread wurden von ${interaction.user.tag} gelöscht.`);

        } catch (error) {
            console.error('Fehler beim Löschen des Vorschlags:', error);
            await interaction.editReply({ content: '❌ Es gab einen Fehler beim Löschen des Vorschlags.' });
        }
    },
};