const { Events, EmbedBuilder } = require('discord.js');
const os = require('os');

module.exports = {
    name: Events.ClientReady,
    async execute(client) {
        const CHANNEL_ID = '1478547111175000127';
        const channel = await client.channels.fetch(CHANNEL_ID).catch(() => null);
        
        if (!channel) {
            return console.log('❌ Status-Kanal nicht gefunden.');
        }

        const createEmbed = () => {
            const now = new Date();
            // Hardware-Infos
            const cpuModel = os.cpus()[0].model;
            const cpuCount = os.cpus().length;
            const totalMemGB = (os.totalmem() / 1024 ** 3).toFixed(1);
            
            // Bot-Infos
            const memUsage = (process.memoryUsage().heapUsed / 1024 ** 2).toFixed(2);
            const timeString = now.toLocaleTimeString('de-DE', { 
                timeZone: 'Europe/Berlin', 
                hour: '2-digit', minute: '2-digit', second: '2-digit', 
                hour12: false 
            });

            return new EmbedBuilder()
                .setTitle('🤖 Bot-Status')
                .setColor('#9900ff')
                .addFields(
                    { name: '⏳ Letzte Aktualisierung', value: `<t:${Math.floor(now.getTime() / 1000)}:R>`, inline: true },
                    { name: '💾 RAM-Verbrauch', value: `${memUsage} MB`, inline: true },
                    { name: '🖥️ CPU Modell', value: cpuModel, inline: false },
                    { name: '⚙️ CPU Kerne', value: `${cpuCount}`, inline: true },
                    { name: '💾 Gesamtspeicher', value: `${totalMemGB} GB`, inline: true },
                    { name: '🕒 Uhrzeit', value: `\`${timeString}\``, inline: true }
                )
                .setFooter({ text: 'Status wird jede Minute aktualisiert' })
                .setTimestamp();
        };

        // Erstes Senden oder Abrufen der Nachricht
        const messages = await channel.messages.fetch({ limit: 1 });
        let statusMsg = messages.first();

        const updateStatus = async () => {
            const embed = createEmbed();
            try {
                if (!statusMsg || statusMsg.author.id !== client.user.id) {
                    statusMsg = await channel.send({ embeds: [embed] });
                } else {
                    await statusMsg.edit({ embeds: [embed] });
                }
            } catch (error) {
                console.error('Fehler beim Aktualisieren des Status-Embeds:', error);
            }
        };

        // Sofortiges Update beim Start und dann alle 60 Sekunden
        await updateStatus();
        setInterval(updateStatus, 60000);
    }
};