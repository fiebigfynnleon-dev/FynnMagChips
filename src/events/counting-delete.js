const { Events } = require('discord.js');

const COUNT_CHANNEL_ID = '1477793605610373151';

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        if (message.channel.id !== COUNT_CHANNEL_ID || message.author.bot) return;

        const num = parseInt(message.content);
        // Wir prüfen nur, ob es eine Zahl war, die gelöscht wurde
        if (!isNaN(num)) {
            message.channel.send(`⚠️ Leider hat ${message.author.toString()} seine letzte Nachricht gelöscht. Die gelöschte Zahl war: **${num}**`);
        }
    }
};