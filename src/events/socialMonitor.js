const Parser = require('rss-parser');
const parser = new Parser();
// Importiere Twitch nur, wenn du die Pakete installiert hast
const { ApiClient } = require('@twurple/api');
const { AppTokenAuthProvider } = require('@twurple/auth');

// Twitch Setup
const authProvider = new AppTokenAuthProvider(process.env.TWITCH_CLIENT_ID, process.env.TWITCH_CLIENT_SECRET);
const apiClient = new ApiClient({ authProvider });

module.exports = {
    // YouTube Funktion
    async checkYouTube(client, ytChannelId, discordChannelId) {
        // ... dein Code ...
    },

    // Twitch Funktion
    async checkTwitch(client, streamerName, discordChannelId) {
        try {
            const user = await apiClient.users.getUserByName(streamerName);
            if (!user) return;
            const stream = await user.getStream();
            if (stream) {
                const channel = await client.channels.fetch(discordChannelId);
                channel.send(`@everyone ${streamerName} ist live!`);
            }
        } catch (e) { console.error(e); }
    },

    // Instagram Funktion (Platzhalter)
    async checkInstagram(client, username, discordChannelId) {
        console.log("Prüfe Instagram...");
    }
};