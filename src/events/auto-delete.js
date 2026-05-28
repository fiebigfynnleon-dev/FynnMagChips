const { Events } = require('discord.js');

const MONITOR_CHANNELS = [
    '1479009457156657242', // Team-Updates
    '1479009508301738066'  // Team-Warns
];

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Ignoriere Nachrichten außerhalb der Liste
        if (!MONITOR_CHANNELS.includes(message.channel.id)) return;

        try {
            const channel = message.channel;
            const messages = await channel.messages.fetch({ limit: 100 });
            const now = Date.now();
            const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000;

            // 1. Lösche Nachrichten, die älter als 2 Wochen sind (einzeln, da BulkDelete nicht geht)
            const oldMessages = messages.filter(msg => (now - msg.createdTimestamp) > twoWeeksInMs);
            for (const [id, msg] of oldMessages) {
                await msg.delete().catch(console.error);
            }

            // 2. Refresh Nachrichtensammlung nach dem Löschen alter Nachrichten
            const remainingMessages = await channel.messages.fetch({ limit: 100 });
            
            // 3. Wenn immer noch mehr als 20 Nachrichten vorhanden sind, lösche die ältesten davon
            if (remainingMessages.size > 20) {
                const messagesToDelete = Array.from(remainingMessages.values())
                    .slice(20); // Nimmt alles ab der 21. Nachricht (die ältesten)

                await channel.bulkDelete(messagesToDelete, true).catch(console.error);
            }
        } catch (error) {
            console.error('Fehler beim automatischen Löschen:', error);
        }
    }
};