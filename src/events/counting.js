const { Events } = require('discord.js');
const fs = require('fs');

const COUNT_CHANNEL_ID = '1477793605610373151';
const DATA_PATH = './counting.json';

function getCountData() {
    if (!fs.existsSync(DATA_PATH)) return { current: 0, lastUser: null };
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
}

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.channel.id !== COUNT_CHANNEL_ID || message.author.bot) return;

        let data = getCountData();
        const num = parseInt(message.content);

        // Wenn es keine Zahl ist, ignorieren wir es einfach
        if (isNaN(num)) return;

        // Spielregeln: Muss genau die nächste Zahl sein UND der User darf nicht der letzte gewesen sein
        if (num === data.current + 1 && message.author.id !== data.lastUser) {
            data.current = num;
            data.lastUser = message.author.id;
            message.react('✅');
        } else {
            // Regelbruch
            message.react('❌');
            message.channel.send(`❌ Fehler! Das Spiel startet bei 0 neu. Die letzte Zahl war ${data.current}, aber du hast ${num} geschrieben oder du durftest noch nicht.`);
            data = { current: 0, lastUser: null };
        }

        fs.writeFileSync(DATA_PATH, JSON.stringify(data));
    }
};