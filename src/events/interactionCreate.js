const { Events, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        try {
            // 1. SLASH COMMANDS
            if (interaction.isChatInputCommand()) {
                const command = interaction.client.commands.get(interaction.commandName);
                if (command) await command.execute(interaction);
            }

            // 2. SELECTION MENUS
            else if (interaction.isStringSelectMenu()) {
                
                // A. EVENT LOCATION SELECTION
                if (interaction.customId === 'event_location_select') {
                    const modal = new ModalBuilder()
                        .setCustomId('event_modal')
                        .setTitle('Event erstellen');

                    const fields = [
                        { id: 'topic', label: 'Thema', style: TextInputStyle.Short },
                        { id: 'start_date', label: 'Startdatum (TT.MM.JJJJ)', style: TextInputStyle.Short },
                        { id: 'start_time', label: 'Startzeit (HH:MM)', style: TextInputStyle.Short },
                        { id: 'end_date', label: 'Enddatum (TT.MM.JJJJ)', style: TextInputStyle.Short },
                        { id: 'end_time', label: 'Endzeit (HH:MM)', style: TextInputStyle.Short },
                        { id: 'desc', label: 'Beschreibung', style: TextInputStyle.Paragraph }
                    ];

                    const rows = fields.map(f => new ActionRowBuilder().addComponents(
                        new TextInputBuilder().setCustomId(f.id).setLabel(f.label).setStyle(f.style).setRequired(true)
                    ));

                    modal.addComponents(...rows);
                    await interaction.showModal(modal);
                }

                // B. SELF-ROLES SELECTION
                else if (interaction.customId === 'self_roles_menu') {
                    const selectedRoles = interaction.values;
                    const allRoleIds = [
                        '1478472971931619368', '1478473095814582362', '1478473312685527071',
                        '1478473869768786213', '1478503454673731766', '1478503702410166393', '1478503779862319135'
                    ];

                    const rolesToRemove = allRoleIds.filter(id => !selectedRoles.includes(id));
                    
                    await interaction.member.roles.remove(rolesToRemove).catch(console.error);
                    await interaction.member.roles.add(selectedRoles).catch(console.error);

                    await interaction.reply({ 
                        content: '✅ Deine Rollen wurden erfolgreich aktualisiert!', 
                        flags: [MessageFlags.Ephemeral] 
                    });
                }
            }

            // 3. MODAL SUBMIT
            else if (interaction.isModalSubmit() && interaction.customId === 'event_modal') {
                const topic = interaction.fields.getTextInputValue('topic');
                await interaction.reply({ 
                    content: `✅ Event **${topic}** wurde erfolgreich in die Warteschlange eingetragen!`, 
                    flags: [MessageFlags.Ephemeral] 
                });
            }
        } catch (error) {
            console.error("Interaction Error:", error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: '❌ Fehler bei der Verarbeitung.', flags: [MessageFlags.Ephemeral] });
            }
        }
    }
};