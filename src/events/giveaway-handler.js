const { Events, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton() || interaction.customId !== 'gw_join') return;

        let data = JSON.parse(fs.readFileSync('./giveaways.json', 'utf8'));
        let gw = data.find(g => g.messageId === interaction.message.id);
        if (!gw) return;

        // Teilnehmen oder Austragen
        if (gw.participants.includes(interaction.user.id)) {
            gw.participants = gw.participants.filter(id => id !== interaction.user.id);
            await interaction.reply({ content: 'Du hast dich wieder ausgetragen.', ephemeral: true });
        } else {
            gw.participants.push(interaction.user.id);
            await interaction.reply({ content: 'Du nimmst am Giveaway teil!', ephemeral: true });
        }
        
        fs.writeFileSync('./giveaways.json', JSON.stringify(data, null, 4));

        // Embed aktualisieren
        const newEmbed = EmbedBuilder.from(interaction.message.embeds[0]);
        // Wir setzen das Feld "Teilnehmer" neu (es ist das erste Feld, daher Index 0)
        newEmbed.spliceFields(0, 1, { name: 'Teilnehmer', value: `${gw.participants.length}`, inline: true });
        
        await interaction.message.edit({ embeds: [newEmbed] });
    }
};