const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

// Hilfsfunktion zum Laden/Speichern der Config
const CONFIG_PATH = './config.json';

function getInitialConfig() {
    return { winMsg: 'Herzlichen Glückwunsch! Du hast gewonnen: {preis}', loseMsg: 'Leider hast du diesmal nicht gewonnen.' };
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config-message')
        .setDescription('Konfiguriere Giveaway Nachrichten')
        .addSubcommand(sub => sub.setName('win-message')
            .setDescription('Setze die Gewinner Nachricht')
            .addStringOption(o => o.setName('text').setDescription('Der Text (nutze {preis} für den Preis)').setRequired(true)))
        .addSubcommand(sub => sub.setName('lose-message')
            .setDescription('Setze die Verlierer Nachricht')
            .addStringOption(o => o.setName('text').setDescription('Der Text').setRequired(true))),

    async execute(interaction) {
        // config.json laden oder neu erstellen
        let config = {};
        if (fs.existsSync(CONFIG_PATH)) {
            config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
        } else {
            config = getInitialConfig();
        }

        const subCommand = interaction.options.getSubcommand();
        const text = interaction.options.getString('text');

        if (subCommand === 'win-message') {
            config.winMsg = text;
            await interaction.reply({ content: '✅ Gewinner-Nachricht gespeichert!', ephemeral: true });
        } else if (subCommand === 'lose-message') {
            config.loseMsg = text;
            await interaction.reply({ content: '✅ Verlierer-Nachricht gespeichert!', ephemeral: true });
        }

        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 4));
    }
};