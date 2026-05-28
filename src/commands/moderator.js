const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mod')
        .setDescription('Moderations-System')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        // Timeout
        .addSubcommand(s => s.setName('timeout').setDescription('Setzt User in Timeout')
            .addUserOption(o => o.setName('user').setDescription('Der User für den Timeout').setRequired(true))
            .addStringOption(o => o.setName('grund').setDescription('Grund für den Timeout').setRequired(true))
            .addIntegerOption(o => o.setName('dauer').setDescription('Dauer in Minuten').setRequired(true)))
        // Kick
        .addSubcommand(s => s.setName('kick').setDescription('Kickt einen User')
            .addUserOption(o => o.setName('user').setDescription('Der User, der gekickt werden soll').setRequired(true))
            .addStringOption(o => o.setName('grund').setDescription('Grund für den Kick').setRequired(true)))
        // Ban
        .addSubcommand(s => s.setName('ban').setDescription('Bannt einen User')
            .addUserOption(o => o.setName('user').setDescription('Der User, der gebannt werden soll').setRequired(true))
            .addStringOption(o => o.setName('grund').setDescription('Grund für den Ban').setRequired(true)))
        // Unban
        .addSubcommand(s => s.setName('unban').setDescription('Entbannt einen User')
            .addUserOption(o => o.setName('user').setDescription('Die User-ID des zu entbannenden Users').setRequired(true))
            .addStringOption(o => o.setName('grund').setDescription('Grund für die Entbannung').setRequired(true))),

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        const user = interaction.options.getUser('user');
        const grund = interaction.options.getString('grund');

        if (sub === 'timeout') {
            const dauer = interaction.options.getInteger('dauer');
            await interaction.options.getMember('user').timeout(dauer * 60 * 1000, grund);
            await interaction.reply(`🔇 ${user.tag} wurde für ${dauer} Min. in den Timeout gesetzt. Grund: ${grund}`);
        }
        else if (sub === 'kick') {
            await interaction.options.getMember('user').kick(grund);
            await interaction.reply(`👢 ${user.tag} wurde gekickt. Grund: ${grund}`);
        }
        else if (sub === 'ban') {
            await interaction.guild.members.ban(user.id, { reason: grund });
            await interaction.reply(`🔨 ${user.tag} wurde gebannt. Grund: ${grund}`);
        }
        else if (sub === 'unban') {
            await interaction.guild.members.unban(user.id, grund);
            await interaction.reply(`🔓 ${user.tag} wurde entbannt. Grund: ${grund}`);
        }
    }
};