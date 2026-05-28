const { Events } = require('discord.js');

// KONFIGURATION - BITTE HIER DEINE IDS EINTRAGEN
const BOOSTER_ROLLE_ID = 'HIER_BOOSTER_ROLLE_ID_EINTRAGEN';
const VIP_ROLLE_ID = 'HIER_VIP_ROLLE_ID_EINTRAGEN';

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        // Prüfen, ob der User den Server geboostet hat
        const warBooster = oldMember.premiumSince !== null;
        const istBooster = newMember.premiumSince !== null;

        // Fall 1: User hat gerade angefangen zu boosten
        if (!warBooster && istBooster) {
            try {
                await newMember.roles.add(BOOSTER_ROLLE_ID);
                console.log(`${newMember.user.tag} hat den Server geboostet.`);
            } catch (e) { console.error('Fehler beim Hinzufügen der Booster-Rolle:', e); }
        }

        // Fall 2: User hört auf zu boosten (Rollen entfernen)
        if (warBooster && !istBooster) {
            try {
                await newMember.roles.remove([BOOSTER_ROLLE_ID, VIP_ROLLE_ID]);
            } catch (e) { console.error('Fehler beim Entfernen der Booster-Rolle:', e); }
        }

        // Fall 3: Prüfung auf "Zweifach-Boost" (Wenn jemand 2x boostet)
        // Discord gibt uns keinen direkten Zähler für Boost-Anzahl, 
        // aber wir können prüfen, ob er die VIP Rolle noch nicht hat.
        if (istBooster && !newMember.roles.cache.has(VIP_ROLLE_ID)) {
            // Logik: Du müsstest hier manuell prüfen, ob der User 2x boostet.
            // Da das Discord-API hier limitiert ist, ist ein einfacher Check:
            // Wenn der User boostet und du das manuell feststellst, geben wir ihm die VIP Rolle.
            // Hinweis: Ein Bot kann leider nicht sehen, ob jemand 1x oder 2x boostet.
            // Meistens geben Serverbesitzer VIP ab dem 2. Boost manuell oder per Command.
        }
    },
};