const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../funkcje.js");

module.exports = {
    name: "banid",
    category: "moderacja",
    description: "Banuje osobę której nie ma na serwerze przez ID",
    usage: "<ID>",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === "logi") || message.channel;

        if (message.deletable) message.delete();

        // No args
        if (!args[0]) {
            return message.reply("❌ Proszę podaj ID.")
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
  let guildm = client.guilds.get(message.guild.id);
  let USER_ID = args[0];
  const toBan = await client.fetchUser(args[0])
    if(!toBan) return message.channel.send("❌ Nie znalazłem osoby z takim ID.")

if (guildm.member(USER_ID)) return message.channel.send("❌ Ta osoba jest na serwerze. Użyj normalnej komendy ban.")
        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setThumbnail(toBan.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`**> Zbanowano:** ${toBan.username}(${toBan.id})
            **> Zbanował:** ${message.member} (${message.member.id})
            **> Powód:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new RichEmbed()
            .setColor("GREEN")
            .setAuthor(`Weryfikacja wygasa w ciągu 30s.`)
            .setDescription(`Czy chcesz zbanować ${toBan.username}(${toBan.id})?`)

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reactioncollector
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            // Verification stuffs
            if (emoji === "✅") {
                msg.delete();
                message.guild.ban(toBan.id, { reason : args.slice(1).join(" ")})
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
