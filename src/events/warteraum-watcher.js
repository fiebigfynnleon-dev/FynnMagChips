const { Events, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');

const WARTERAUM_ID = '1478539518431985835';

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        // Prüfen, ob der User den Warteraum betreten hat
        if (newState.channelId === WARTERAUM_ID && oldState.channelId !== WARTERAUM_ID) {
            const channel = newState.guild.channels.cache.get(WARTERAUM_ID);
            if (!channel) return;

            const select = new StringSelectMenuBuilder()
                .setCustomId('select_buero')
                .setPlaceholder('Welches Büro möchtest du besuchen?')
                .addOptions([
                    { label: 'Leitungsbüro', value: '1478469318659539065' },
                    { label: 'FynnMagChips Büro', value: '1478469575572983929' },
                    { label: 'Assistentsbüro', value: '1478470290102026250' },
                    { label: 'Server Management Büro', value: '1478470522827309217' },
                    { label: 'Stv. Server Management Büro', value: '1478470645477281882' },
                    { label: 'Video-Stream Management Büro', value: '1478470966077161613' },
                    { label: 'Stv. Video-Stream Management Büro', value: '1478471438221574186' },
                    { label: 'Teamleiter Management Büro', value: '1478471932839202898' },
                    { label: 'Teamleitersbüro', value: '1478472172703060130' },
                    { label: 'Stv. Teamleitersbüro', value: '1478472662081601729' },
                    { label: 'Head Moderator Büro', value: '1508377022072750100' }
                ]);

            const row = new ActionRowBuilder().addComponents(select);

            // Nachricht direkt in den Warteraum-Kanal senden
            await channel.send({ 
                content: `${newState.member}, willkommen im Warteraum. Wähle dein Ziel aus:`, 
                components: [row] 
            });
        }
    }
};