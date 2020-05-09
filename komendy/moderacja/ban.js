const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../funkcje.js");

module.exports = {
    name: "ban",
    category: "moderacja",
    description: "Banuje osobę",
    usage: "<ID/Oznaczenie>",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === "logi") || message.channel;

        if (message.deletable) message.delete();

        // No args
        if (!args[0]) {
            return message.reply("❌ Proszę podaj kogo zbanować.")
        }

        // No reason
        if (!args[1]) {
            return message.reply("❌ Proszę podaj powód bana.")
        }

        // No author permissions
        if (!message.member.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ Nie masz uprawnień")
        }
        // No bot permissions
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ Nie mam uprawnień")
        }

        const toBan = message.mentions.members.first() || message.guild.members.get(args[0]);
        // No member found
        if (!toBan) {
            return message.reply("❌ Nie mogłem znaleść tej osoby...")
        }

        // Can't ban urself
        if (toBan.id === message.author.id) {
            return message.reply("❌ Nie możesz zbanować sam siebie...")
        }
        if (toBan.hasPermission("BAN_MEMBERS")) return message.channel.send("❌ Nie mogę zbanować tej osoby.");
        // Check if the user's banable
        if (!toBan.bannable) {
            return message.reply("❌ Nie mogę zbanować tej osoby prawdopodobnie przez hierarchię ról...")
        }
        
        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setThumbnail(toBan.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`**> Zbanowano:** ${toBan} (${toBan.id})
            **> Zbanował:** ${message.member} (${message.member.id})
            **> Powód:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new RichEmbed()
            .setColor("GREEN")
            .setAuthor(`Weryfikacja wygasa w ciągu 30s.`)
            .setDescription(`Czy chcesz zbanować ${toBan}?`)

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reactioncollector
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            // Verification stuffs
            if (emoji === "✅") {
                msg.delete();
		toBan.send(embed);
                toBan.ban(args.slice(1).join(" "))
                    .catch(err => {
                        if (err) return message.channel.send(`Error: ${err}`)
                    });

                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`Ban anulowany.`)
            }
        });
    }
};
