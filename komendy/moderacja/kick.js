const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../funkcje.js");

module.exports = {
    name: "kick",
    category: "moderacja",
    description: "Wyrzuca osobę",
    usage: "<ID/Oznaczenie>",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === "logi") || message.channel;

        if (message.deletable) message.delete();

        // No args
        if (!args[0]) {
            return message.reply("❌ Proszę podaj kogo wyrzucić.")
        }

        // No reason
        if (!args[1]) {
            return message.reply("❌ Proszę podaj powód wyrzucenia.")
        }
        // No author permissions
        if (!message.member.hasPermission("KICK_MEMBERS")) {
            return message.reply("❌ Nie masz uprawnień")
        }

        // No bot permissions
        if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
            return message.reply("❌ Nie mam uprawnień")
        }

        const toKick = message.mentions.members.first() || message.guild.members.get(args[0]);
        if (toKick.hasPermission("KICK_MEMBERS")) return message.channel.send("❌ Nie mogę wyrzucić tej osoby.");
        // No member found
        if (!toKick) {
            return message.reply("❌ Nie mogłem znaleść tej osoby...")
        }

        // Can't kick urself
        if (toKick.id === message.author.id) {
            return message.reply("❌ Nie możesz wyrzucić sam siebie...")
        }

        // Check if the user's kickable
        if (!toKick.kickable) {
            return message.reply("❌ Nie mogę wyrzucić tej osoby prawdopodobnie przez hierarchię ról...")
        }
                
        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setThumbnail(toKick.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`**> Wyrzucono:** ${toKick} (${toKick.id})
            **> Wyrzucił:** ${message.member} (${message.member.id})
            **> Powód:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new RichEmbed()
            .setColor("GREEN")
            .setAuthor(`Weryfikacja wygasa w ciągu 30s.`)
            .setDescription(`Czy chcesz wyrzucić ${toKick}?`)

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reaction collector
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            // The verification stuffs
            if (emoji === "✅") {
                msg.delete();
		toKick.send(embed);
                toKick.kick(args.slice(1).join(" "))
                    .catch(err => {
                        if (err) return message.channel.send(`Error: ${err}`)
                    });

                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`Wyrzucenie anulowane.`)
            }
        });
    }
};
