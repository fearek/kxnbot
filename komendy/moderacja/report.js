const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "report",
    aliases: ["zgłoś", "zglos"],
    category: "moderacja",
    description: "Zgłasza użytkownika",
    usage: "<oznaczenie, powód>",
    run: async (client, message, args) => {
        if (message.deletable) message.delete();

        let rMember = message.mentions.members.first() || message.guild.members.get(args[0]);

        if (!rMember)
            return message.reply("Nie mogę znaleść takiej osoby.");

        if (rMember.hasPermission("BAN_MEMBERS") || rMember.user.bot)
            return message.channel.send("Nie można zgłosić tego użytkownika.");

        if (!args[1])
            return message.channel.send("Podaj powód zgłoszenia.");
        
        const channel = message.guild.channels.find(c => c.name === "mzgłoszenia")
            
        if (!channel)
            return message.channel.send("Nie znaleziono kanału do zgłoszeń.");

        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor("Zgłoszono", rMember.user.displayAvatarURL)
            .setDescription(stripIndents`**> Użytkownik:** ${rMember} (${rMember.user.id})
            **> Zgłoszony przez:** ${message.member}
            **> Zgłoszony w:** ${message.channel}
            **> Powód:** ${args.slice(1).join(" ")}`);

        return channel.send(embed);
    }
}
