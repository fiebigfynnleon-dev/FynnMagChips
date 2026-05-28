const { Events, StringSelectMenuBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const PING_KANAL_ID = '1500838887965069372';

const BUERO_MAP = {
    '1478469318659539065': '1478539795213848799',
    '1478469575572983929': '1478540189449322526',
    '1478470290102026250': '1478540500985446562',
    '1478470522827309217': '1478540618971091177',
    '1478470645477281882': '1478540650172645517',
    '1478470966077161613': '1478540799586209865',
    '1478471438221574186': '1478540909758120114',
    '1478471932839202898': '1478541199378743337',
    '1478472172703060130': '1478541261966278887',
    '1478472662081601729': '1478541296816881704',
    '1508377022072750100': '1478634136116789349'
};

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // 1. Dropdown verarbeiten
        if (interaction.isStringSelectMenu() && interaction.customId === 'select_buero') {
            const roleId = interaction.values[0];
            const pingKanal = interaction.client.channels.cache.get(PING_KANAL_ID);
            
            const embed = new EmbedBuilder()
                .setTitle('Büro-Anfrage')
                .setDescription(`Der User ${interaction.user} wartet im Büro-Warteraum.`)
                .setColor('#FFD700');

            const button = new ButtonBuilder()
                .setCustomId(`move_${roleId}_${interaction.user.id}`)
                .setLabel('Ins Büro moven')
                .setStyle(ButtonStyle.Success);

            await pingKanal.send({ 
                content: `<@&${roleId}> Ein Mitglied benötigt Zutritt!`, 
                embeds: [embed], 
                components: [new ActionRowBuilder().addComponents(button)] 
            });

            await interaction.reply({ content: '✅ Deine Anfrage wurde an das Team gesendet.', ephemeral: true });
        }

        // 2. Button verarbeiten (Moven & Nachricht löschen)
        if (interaction.isButton() && interaction.customId.startsWith('move_')) {
            const [_, roleId, memberId] = interaction.customId.split('_');
            const targetChannelId = BUERO_MAP[roleId];
            
            try {
                const member = await interaction.guild.members.fetch(memberId);
                if (targetChannelId && member.voice.channel) {
                    await member.voice.setChannel(targetChannelId);
                    await interaction.reply({ content: '✅ User wurde gemovt.', ephemeral: true });
                    
                    // Nachricht im Ping-Kanal löschen
                    await interaction.message.delete();
                } else {
                    await interaction.reply({ content: '❌ Fehler: User ist nicht mehr im Voice.', ephemeral: true });
                }
            } catch (err) {
                console.error('Fehler beim Moven:', err);
                await interaction.reply({ content: '❌ Fehler beim Ausführen der Aktion.', ephemeral: true });
            }
        }
    }
};