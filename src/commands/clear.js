const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Löscht eine bestimmte Anzahl an Nachrichten')
        .addIntegerOption(o => o.setName('anzahl')
            .setDescription('Wie viele Nachrichten sollen gelöscht werden?')
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const amount = interaction.options.getInteger('anzahl');

        // Eigene Prüfungen für die Mindest- und Maximalanzahl
        if (amount < 5) {
            return await interaction.reply({ 
                content: '❌ Leider hast du die Mindestanzahl nicht erreicht. Die Mindestanzahl ist 5 Nachrichten!', 
                ephemeral: true 
            });
        }

        if (amount > 5000) {
            return await interaction.reply({ 
                content: '❌ Leider hast du über die maximale Anzahl gegeben. Du kannst nur maximal 5000 Nachrichten löschen!', 
                ephemeral: true 
            });
        }

        await interaction.deferReply({ ephemeral: true });

        try {
            let remaining = amount;
            let totalDeleted = 0;

            while (remaining > 0) {
                const batchSize = Math.min(remaining, 100);
                const deleted = await interaction.channel.bulkDelete(batchSize, true);
                
                if (deleted.size === 0) break;
                
                totalDeleted += deleted.size;
                remaining -= deleted.size;
                
                if (deleted.size < batchSize) break;
            }

            await interaction.editReply({ 
                content: `✅ Erfolgreich **${totalDeleted}** Nachrichten gelöscht.\n*Info: Nachrichten, die älter als 2 Wochen sind, können technisch nicht gelöscht werden.*` 
            });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: '❌ Fehler beim Löschen. Bitte prüfe, ob ich die Berechtigung habe.' });
        }
    }
};