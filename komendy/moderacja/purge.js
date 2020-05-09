	const Discord = require("discord.js");
module.exports = {
    name: "prune",
    aliases: ["usuń", "czyść", "czys"],
    category: "moderacja",
    description: "Usuwa wiadomości",
    usage: "<ilość>",
    run: async (client, message, args) => {
				if(!message.member.hasPermission("MANAGE_MESSAGES") || !message.guild.owner) return message.channel.send("Nie masz uprawnień.");
		if(!message.guild.me.hasPermission(["MANAGE_MESSAGES", "ADMINISTRATOR"])) return message.channel.send("Nie mam uprawnień");
let messagecount = parseInt(args.join(' '));
	messagecount++
	if(messagecount>11){
	message.channel.send("Za dużo wiadomości do usunięcia.");
	}
	else {
	message.channel.fetchMessages({limit: messagecount}).then(messages => message.channel.bulkDelete(messages));
	var warnEmbed = new Discord.RichEmbed()
   .setDescription("Prune")
   .setColor("#ee0000")
   .addField("Wyczyścił:", message.author.username)
   .addField("Ilość wiadomości:", messagecount-1)
   .addField("Kanał:", message.channel)
   var warnChannel = message.guild.channels.find(`name`, "logi");
   if (!warnChannel) return message.guild.send("Nie znalazłem kanału do składania zgłoszeń.");
   warnChannel.send(warnEmbed);
	}
    }
}
