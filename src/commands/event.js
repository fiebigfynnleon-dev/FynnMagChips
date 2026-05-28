const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event')
        .setDescription('Event-Management')
        .addSubcommand(sub => sub.setName('add').setDescription('Starte den Event-Erstellungs-Assistenten'))
        .addSubcommand(sub => sub.setName('remove').setDescription('Entferne ein Event').addStringOption(o => o.setName('name').setDescription('Event-Name').setRequired(true)))
        .addSubcommand(sub => sub.setName('start').setDescription('Starte ein Event').addStringOption(o => o.setName('name').setDescription('Event-Name').setRequired(true)))
        .addSubcommand(sub => sub.setName('stop').setDescription('Stoppe ein Event').addStringOption(o => o.setName('name').setDescription('Event-Name').setRequired(true))),

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();

        if (sub === 'add') {
            const row = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('event_location_select')
                    .setPlaceholder('Wo findet dein Event statt?')
                    .addOptions([
                        { label: 'Stage-Kanal', value: 'stage' },
                        { label: 'Sprachkanal', value: 'voice' },
                        { label: 'Irgendwo anders', value: 'other' }
                    ])
            );

            await interaction.reply({ 
                content: 'Wähle bitte den Ort/Typ deines Events:', 
                components: [row], 
                ephemeral: true 
            });
        } else {
            await interaction.reply({ content: `Der Befehl /event ${sub} ist aktuell noch in Arbeit.`, ephemeral: true });
        }
    }
};