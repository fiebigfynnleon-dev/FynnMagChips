// src/events/socialHandler.js

module.exports = {
    async sendNotification(client, platform, channelId, message) {
        try {
            const channel = await client.channels.fetch(channelId);
            if (channel) {
                await channel.send(message);
                console.log(`${platform} Nachricht gesendet an ${channelId}`);
            }
        } catch (error) {
            console.error(`Fehler beim Senden der ${platform} Nachricht:`, error);
        }
    }
};