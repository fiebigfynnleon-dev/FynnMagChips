require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes, Events, ActivityType } = require('discord.js');
const fs = require('fs');
const path = require('path');

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

// Events laden (WICHTIG: Hier wird die interactionCreate.js geladen)
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

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
        console.log('🚀 Slash-Commands registriert.');
    } catch (e) { console.error(e); }
});

client.login(process.env.DISCORD_TOKEN);