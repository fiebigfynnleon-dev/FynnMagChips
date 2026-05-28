const { Events, ChannelType } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Prüfen, ob Ankündigungskanal und nicht vom Bot
        if (message.channel.type !== ChannelType.GuildAnnouncement || message.author.bot) {
            return;
        }

        try {
            // 1. Nachricht veröffentlichen
            await message.crosspost();
            
            // 2. Reaktion hinzufügen (wir nutzen den String mit dem Namen/ID für das Emoji)
            const reaction = await message.react('1502254346304229426'); 
            
            // 3. Nach 1 Sekunden (1000ms) die Reaktion wieder entfernen
            setTimeout(async () => {
                try {
                    await reaction.remove();
                } catch (err) {
                    console.error("Konnte Reaktion nicht entfernen:", err);
                }
            }, 1000);
            
            console.log(`📢 Nachricht in ${message.channel.name} veröffentlicht (Reaktion nach 5s entfernt).`);
        } catch (error) {
            console.error(`Fehler bei Auto-Publish: ${error.message}`);
        }
    }
};