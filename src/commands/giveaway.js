const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Startet ein neues Giveaway')
        .addStringOption(o => o.setName('preis').setDescription('Was gibt es zu gewinnen?').setRequired(true))
        .addIntegerOption(o => o.setName('gewinner').setDescription('Anzahl der Gewinner').setRequired(true))
        .addIntegerOption(o => o.setName('dauer').setDescription('Dauer in Minuten').setRequired(true)),

    async execute(interaction) {
        const preis = interaction.options.getString('preis');
        const anzahl = interaction.options.getInteger('gewinner');
        const dauer = interaction.options.getInteger('dauer');
        
        const ende = Date.now() + (dauer * 60 * 1000);
        
        const embed = new EmbedBuilder()
            .setTitle('🎁 GIVEAWAY 🎁')
            .setDescription(`Gewinne: **${preis}**\nGewinner: ${anzahl}\nEndet in: <t:${Math.floor(ende/1000)}:R>`)
            .addFields({ name: 'Teilnehmer', value: '0', inline: true })
            .setColor('Gold');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('gw_join').setLabel('Mitmachen').setStyle(ButtonStyle.Success)
        );

        const msg = await interaction.client.channels.cache.get('1477790038799421480').send({ embeds: [embed], components: [row] });
        
        // Speichere Giveaway
        const data = JSON.parse(fs.readFileSync('./giveaways.json', 'utf8'));
        data.push({ messageId: msg.id, preis, anzahl, ende, participants: [] });
        fs.writeFileSync('./giveaways.json', JSON.stringify(data, null, 4));

        await interaction.reply({ content: 'Giveaway gestartet!', ephemeral: true });
    }
};