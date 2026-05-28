const { Events, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');

// KONFIGURATION
const ZIEL_KANAL_ID = '1508221606164693132'; // Kanal für Allgemein & Event
const MEINE_USER_ID = '957522036450791486';   // Deine ID für DM

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        
        // 1. BUTTON KLICK: Kategorie wählen
        if (interaction.isButton() && interaction.customId === 'btn_vorschlag_start') {
            const select = new StringSelectMenuBuilder()
                .setCustomId('menu_kategorie')
                .setPlaceholder('Wähle den Vorschlagstyp...')
                .addOptions([
                    { label: 'Allgemeiner Vorschlag', value: 'allgemein' },
                    { label: 'Event Vorschlag', value: 'event' },
                    { label: 'Stream Idee', value: 'stream' }
                ]);

            const row = new ActionRowBuilder().addComponents(select);
            return await interaction.reply({ content: 'Welche Art von Vorschlag möchtest du einreichen?', components: [row], ephemeral: true });
        }

        // 2. AUSWAHLMENÜ: Kategorie bestätigt -> Modal öffnen
        if (interaction.isStringSelectMenu() && interaction.customId === 'menu_kategorie') {
            const kategorie = interaction.values[0];
            const modal = new ModalBuilder()
                .setCustomId(`modal_vorschlag_${kategorie}`)
                .setTitle('Dein Vorschlag');
            
            const titelInput = new TextInputBuilder()
                .setCustomId('v_titel')
                .setLabel('Titel des Vorschlags')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);
            
            const textInput = new TextInputBuilder()
                .setCustomId('v_text')
                .setLabel('Beschreibe deinen Vorschlag')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);
            
            modal.addComponents(
                new ActionRowBuilder().addComponents(titelInput),
                new ActionRowBuilder().addComponents(textInput)
            );
            return await interaction.showModal(modal);
        }

        // 3. MODAL ABSENDEN: Vorschlag verarbeiten
        if (interaction.isModalSubmit() && interaction.customId.startsWith('modal_vorschlag_')) {
            await interaction.deferReply({ ephemeral: true });
            
            const kategorie = interaction.customId.split('_')[2];
            const titel = interaction.fields.getTextInputValue('v_titel');
            const text = interaction.fields.getTextInputValue('v_text');

            const katNamen = { 'allgemein': 'Allgemeiner Vorschlag', 'event': 'Event Vorschlag', 'stream': 'Stream Idee' };

            // Embed erstellen
            const vEmbed = new EmbedBuilder()
                .setTitle(`Thema: ${titel}`)
                .setDescription(text)
                .setColor(kategorie === 'stream' ? '#9b59b6' : '#1E2A38')
                .addFields(
                    { name: 'Kategorie', value: katNamen[kategorie], inline: true },
                    { name: 'Autor', value: `${interaction.user}`, inline: true },
                    { name: 'Status', value: 'Offen', inline: true }
                )
                .setFooter({ text: `Eingereicht am ${new Date().toLocaleDateString('de-DE')}` });

            try {
                // LOGIK: Stream-Idee nur per DM an dich
                if (kategorie === 'stream') {
                    const user = await interaction.client.users.fetch(MEINE_USER_ID);
                    await user.send({ 
                        content: `🔔 **Neue Stream-Idee von ${interaction.user.tag}:**`, 
                        embeds: [vEmbed] 
                    });
                } 
                // LOGIK: Andere Kategorien in den öffentlichen Kanal
                else {
                    const zielKanal = interaction.client.channels.cache.get(ZIEL_KANAL_ID);
                    if (!zielKanal) throw new Error('Kanal nicht gefunden');
                    
                    const msg = await zielKanal.send({ embeds: [vEmbed] });
                    await msg.react('👍');
                    await msg.react('👎');
                }

                await interaction.editReply({ content: '✅ Dein Vorschlag wurde erfolgreich eingereicht!' });
            } catch (err) {
                console.error('Fehler:', err);
                await interaction.editReply({ content: '❌ Fehler: Konnte den Vorschlag nicht senden (DM evtl. blockiert oder Kanal fehlt).' });
            }
        }
    }
};