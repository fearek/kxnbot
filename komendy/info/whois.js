const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getMember, formatDate } = require("../../funkcje.js");

module.exports = {
    name: "whois",
    aliases: ["who", "user", "info", "kto"],
    category: "info",
    description: "Zwraca informacje o użytkowniku",
    usage: "[Nick/ID/Oznaczenie]",
    run: (client, message, args) => {
        const member = getMember(message, args.join(" "));

        // Member variables
        const joined = formatDate(member.joinedAt);
        const roles = member.roles
            .filter(r => r.id !== message.guild.id)
            .map(r => r).join(", ") || 'none';

        // User variables
        const created = formatDate(member.user.createdAt);

        const embed = new RichEmbed()
            .setFooter(member.displayName, member.user.displayAvatarURL)
            .setThumbnail(member.user.displayAvatarURL)
            .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)

            .addField('Serwerowe:', stripIndents`**> Nick:** ${member.displayName}
            **> Dołączył:** ${joined}
            **> Role:** ${roles}`, true)

            .addField('Ogólne:', stripIndents`**> ID:** ${member.user.id}
            **> Nick**: ${member.user.username}
            **> Tag**: ${member.user.tag}
            **> Stworzono**: ${created}`)
            
            .setTimestamp()

        if (member.user.presence.game) 
            embed.addField('Obecnie gra', stripIndents`**> Nazwa:** ${member.user.presence.game.name}`);

        message.channel.send(embed);
    }
}
