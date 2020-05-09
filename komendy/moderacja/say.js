const { RichEmbed } = require("discord.js");
discord = require("discord.js");
module.exports = {
    name: "say",
    category: "moderacja",
    aliases: ["bc", "broadcast", "powiedz"],
    description: "Bot wysyła to co chcesz",
    usage: "<input>",
    run: (client, message, args) => {
        message.delete();

        if (!message.member.hasPermission("MANAGE_MESSAGES"))
            return message.reply("Nie masz uprawnień.");

        if (args.length < 0)
            return message.reply("Nie masz nic do powiedzenia?");

        const roleColor = message.guild.me.highestRole.hexColor;

        if (args[0].toLowerCase() === "embed") {
            const embed = new RichEmbed()
                .setDescription(args.slice(1).join(" "))
                .setColor(roleColor === "#000000" ? "#ffffff" : roleColor);

            message.channel.send(embed);
        } else {
            message.channel.send(args.join(" "));
        }
        var sayEmbed = new discord.RichEmbed()
        .setDescription("Say")
        .setColor("#ee0000")
        .addField("Powiedział:", message.member)
        .addField("Na kanale:", message.channel)
        .addField("Treść:", args.join(" "));
        var warnChannel = message.guild.channels.find(`name`, "logi");
        if (!warnChannel) return message.guild.send("❌ Nie znalazłem kanału do składania zgłoszeń.");
        warnChannel.send(sayEmbed);
    }
}
