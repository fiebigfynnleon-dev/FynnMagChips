const { Events, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const LOG_KANAL_ID = '1479011004812623902';
const WARTERAUM_ID = '1478539191582199828';
const ROLLE_SUPPORT_ID = '1478388940162596925';

const RAUM_MAP = [
    { id: '1479010320751267920', name: 'Support 1' },
    { id: '1479010432680333473', name: 'Support 2' },
    { id: '1479010466691940485', name: 'Support 3' },
    { id: '1479010504088490146', name: 'Support 4' },
    { id: '1479010554940096654', name: 'Support 5' },
    { id: '1479010609810112699', name: 'Support 6' }
];

async function updateSupportPanel(guild) {
    const channel = guild.channels.cache.get(LOG_KANAL_ID);
    if (!channel) return;

    const row1 = new ActionRowBuilder();
    const row2 = new ActionRowBuilder();

    RAUM_MAP.forEach((raum, index) => {
        const vc = guild.channels.cache.get(raum.id);
        const isFull = vc && vc.members.size > 0;
        
        const button = new ButtonBuilder()
            .setCustomId('support_' + raum.id)
            .setLabel(raum.name)
            .setStyle(isFull ? ButtonStyle.Secondary : ButtonStyle.Success)
            .setDisabled(isFull);

        if (index < 3) {
            row1.addComponents(button);
        } else {
            row2.addComponents(button);
        }
    });

    const messages = await channel.messages.fetch({ limit: 10 });
    const botMsg = messages.find(m => m.author.id === guild.client.user.id && m.components.length > 0);

    const contentText = '🔔 <@&' + ROLLE_SUPPORT_ID + '>\n\n### Support-Raum Auswahl\nWähle einen grünen Knopf, um in den Support-Raum gemovt zu werden:';

    if (botMsg) {
        await botMsg.edit({ content: contentText, components: [row1, row2] });
    } else {
        await channel.send({ content: contentText, components: [row1, row2] });
    }
}

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        const guild = newState.guild;
        const targetIds = RAUM_MAP.map(r => r.id);

        // 1. Wenn jemand den Warteraum betritt
        if (newState.channelId === WARTERAUM_ID && oldState.channelId !== WARTERAUM_ID) {
            await updateSupportPanel(guild);
        }

        // 2. Wenn jemand den Warteraum verlässt
        if (oldState.channelId === WARTERAUM_ID && newState.channelId !== WARTERAUM_ID) {
            const isNowInSupportRoom = targetIds.includes(newState.channelId);

            if (!isNowInSupportRoom) {
                const channel = guild.channels.cache.get(LOG_KANAL_ID);
                if (channel) {
                    const messages = await channel.messages.fetch({ limit: 10 });
                    const botMsg = messages.find(m => m.author.id === newState.client.user.id && m.components.length > 0);
                    
                    if (botMsg) {
                        await botMsg.delete();
                        await channel.send('ℹ️ Das Mitglied **' + oldState.member.displayName + '** hat den Warteraum verlassen.');
                    }
                }
            }
        }

        // 3. Status-Updates für Support-Räume
        if (targetIds.includes(newState.channelId) || targetIds.includes(oldState.channelId)) {
            await updateSupportPanel(guild);
        }
    },
    async init(client) {
        const guild = client.guilds.cache.first();
        if (guild) await updateSupportPanel(guild);
    }
};