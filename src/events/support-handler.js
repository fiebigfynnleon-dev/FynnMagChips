const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton() || !interaction.customId.startsWith('support_')) return;

        const kanalId = interaction.customId.split('_')[1];
        const channel = interaction.guild.channels.cache.get(kanalId);
        const logChannel = interaction.guild.channels.cache.get('1479011004812623902');

        if (channel.members.size > 0) {
            return await interaction.reply({ content: '❌ Dieser Support-Raum ist belegt!', ephemeral: true });
        }

        try {
            await interaction.member.voice.setChannel(channel);
            await interaction.reply({ content: `✅ Du wurdest in ${channel.name} gemovt.`, ephemeral: true });

            // NEU: Suche die Nachricht mit den Buttons im Log-Kanal und lösche sie
            const messages = await logChannel.messages.fetch({ limit: 10 });
            const botMsg = messages.find(m => m.author.id === interaction.client.user.id && m.components.length > 0);
            if (botMsg) {
                await botMsg.delete();
                await logChannel.send(`ℹ️ Das Mitglied **${interaction.member.displayName}** wurde in **${channel.name}** gemovt.`);
            }
        } catch (e) {
            console.error(e);
            await interaction.reply({ content: '❌ Fehler beim Moven.', ephemeral: true });
        }
    }
};