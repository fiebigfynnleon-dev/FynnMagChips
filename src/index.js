require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes, Events, ActivityType, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const os = require('os'); // Für System-Infos

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.commands = new Collection();
const commands = [];

// Commands laden
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        }
    }
}

// Events laden
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    if (event.name) {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.once(Events.ClientReady, async () => {
    console.log(`✅ ${client.user.tag} ist online!`);
    client.user.setActivity('FynnMagChips', { type: ActivityType.Watching });

    // --- STATUS-MONITOR LOGIK ---
    const channelId = '1478547111175000127';
    const channel = await client.channels.fetch(channelId).catch(() => null);

    if (channel) {
        const createEmbed = () => {
            const now = new Date();
            const mem = process.memoryUsage().heapUsed / 1024 / 1024;
            const cpuModel = os.cpus()[0].model;
            const cpuCount = os.cpus().length;
            const totalMemGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
            const timeString = now.toLocaleTimeString('de-DE', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', second: '2-digit' });
            
            return new EmbedBuilder()
                .setTitle('🤖 Bot-Status')
                .setColor('#9900ff')
                .addFields(
                    { name: '⏳ Letzte Aktualisierung', value: `<t:${Math.floor(now.getTime() / 1000)}:R>`, inline: true },
                    { name: '💾 RAM-Verbrauch (Bot)', value: `${mem.toFixed(2)} MB`, inline: true },
                    { name: '🖥️ CPU Modell', value: `${cpuModel}`, inline: false },
                    { name: '⚙️ CPU Kerne', value: `${cpuCount}`, inline: true },
                    { name: '💾 Gesamtspeicher', value: `${totalMemGB} GB`, inline: true },
                    { name: '🕒 Uhrzeit', value: `\`${timeString}\``, inline: true }
                )
                .setFooter({ text: 'Status wird jede Minute aktualisiert' })
                .setTimestamp();
        };

        // Nachricht senden oder aktualisieren
        const messages = await channel.messages.fetch({ limit: 1 });
        let statusMsg = messages.first();
        if (!statusMsg || statusMsg.author.id !== client.user.id) {
            statusMsg = await channel.send({ embeds: [createEmbed()] });
        } else {
            await statusMsg.edit({ embeds: [createEmbed()] });
        }

        // Alle 60 Sekunden aktualisieren
        setInterval(async () => {
            try { await statusMsg.edit({ embeds: [createEmbed()] }); } catch (e) { console.error(e); }
        }, 60000);
    }
    // --- ENDE STATUS-MONITOR ---

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
        console.log('🚀 Slash-Commands registriert.');
    } catch (e) { console.error(e); }
});

client.login(process.env.DISCORD_TOKEN);
