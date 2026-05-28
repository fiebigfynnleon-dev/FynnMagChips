const { Events } = require('discord.js');

const IDS = { /* ... deine IDs ... */ };

async function updateStats(guild) {
    // KEIN fetch() nötig, wir nutzen den cache
    const totalCount = guild.memberCount;
    const botCount = guild.members.cache.filter(m => m.user.bot).size;
    const userCount = totalCount - botCount;
    const boostCount = guild.premiumSubscriptionCount;
    const vipCount = guild.members.cache.filter(m => m.roles.cache.has(IDS.vipRole)).size;

    const stats = [
        { id: IDS.total, name: `👥 Total: ${totalCount}` },
        { id: IDS.user, name: `👤 User: ${userCount}` },
        { id: IDS.bot, name: `🤖 Bots: ${botCount}` },
        { id: IDS.boost, name: `🚀 Boosts: ${boostCount}` },
        { id: IDS.vip, name: `⭐ VIPs: ${vipCount}` }
    ];

    for (const stat of stats) {
        const channel = guild.channels.cache.get(stat.id);
        if (channel && channel.name !== stat.name) {
            await channel.setName(stat.name).catch(console.error);
        }
    }
}

module.exports = {
    name: Events.ClientReady,
    async execute(client) {
        const guild = client.guilds.cache.first();
        if (!guild) return;

        await updateStats(guild);
        
        // Listener registrieren
        client.on(Events.GuildMemberAdd, (member) => updateStats(member.guild));
        client.on(Events.GuildMemberRemove, (member) => updateStats(member.guild));
        client.on(Events.GuildUpdate, (oldG, newG) => updateStats(newG));
    }
};