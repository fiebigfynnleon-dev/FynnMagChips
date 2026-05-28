const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    async execute(client) {
        const channel = await client.channels.fetch('1478547111175000127').catch(() => null);
        if (!channel) return console.log('❌ Status-Kanal nicht gefunden.');

        const createEmbed = () => {
            const mem = process.memoryUsage().heapUsed / 1024 / 1024;
            const cpuUsage = (process.cpuUsage().user / 1000000).toFixed(2);
            
            // Berliner Zeit für die Anzeige
            const now = new Date();
            const timeString = now.toLocaleTimeString('de-DE', { 
                timeZone: 'Europe/Berlin',
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: false 
            });

            // Aktueller Zeitstempel für Discord-Countdown
            const unixTimestamp = Math.floor(now.getTime() / 1000);

            return new EmbedBuilder()
                .setTitle('🤖 Bot-Status')
                .setColor('#9900ff')
                .addFields(
                    { name: '⏳ Letzte Aktualisierung', value: `<t:${unixTimestamp}:R>`, inline: true },
                    // Feld 2: Uhrzeit (exakt)
                    { name: '💾 Datenverbrauch', value: `${mem.toFixed(2)} MB`, inline: true },
                    { name: '⚡ Systemleistung (Load)', value: `${cpuUsage}%`, inline: true },
                    { name: '🔥 Hauptverbraucher', value: 'Node.js Heap Memory', inline: false },
                    // Feld 1: Countdown (relativ)
                    { name: '🕒 Uhrzeit', value: `\`${timeString}\``, inline: true }
                )
                .setFooter({ text: 'Status wird jede Minute aktualisiert' })
                .setTimestamp();
        };

        const messages = await channel.messages.fetch({ limit: 1 });
        let statusMsg = messages.first();

        if (!statusMsg || statusMsg.author.id !== client.user.id) {
            statusMsg = await channel.send({ embeds: [createEmbed()] });
        } else {
            await statusMsg.edit({ embeds: [createEmbed()] });
        }

        setInterval(async () => {
            try {
                await statusMsg.edit({ embeds: [createEmbed()] });
            } catch (error) {
                console.error('Fehler beim Aktualisieren des Status-Embeds:', error);
            }
        }, 60000);
    }
};