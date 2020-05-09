const { Client, Collection } = require("discord.js");
const { RichEmbed, Emoji, MessageReaction } = require('discord.js');
const config = require("./config.json");
const fs = require("fs");
const CONFIG = require('./config.js');
const client = new Client({
    disableEveryone: true
});
//MASTER
client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./komendy/");


["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});
function aktualizujOsoby() {
    let serwerKXN = client.guilds.get('633229348060659712');
    let liczbaOsob = serwerKXN.memberCount;
    let kanalCzlonkowie = serwerKXN.channels.get('682558658193784882');
    kanalCzlonkowie.setName('Liczba Członków: '+liczbaOsob).then(result => console.log("Kanal Liczba Czlonkow zmieniony")).catch(err => console.log(err));
}
function aktualizujWidzow() {
    let serwerKXN = client.guilds.get('633229348060659712');
    let liczbaWidzow = serwerKXN.roles.get('648617707389845531').members.size;
    let kanalWidzowie = serwerKXN.channels.get('682558704687906863');
    kanalWidzowie.setName('Widzowie: '+liczbaWidzow).then(result => console.log("Kanal Liczba Widzow zmieniony")).catch(err => console.log(err));
}
function aktualizujOnline() {
    let serwerKXN = client.guilds.get('633229348060659712');
    let liczbaOnline = serwerKXN.members.filter(m => m.presence.status === 'online').size + serwerKXN.members.filter(m => m.presence.status === 'idle').size + serwerKXN.members.filter(m => m.presence.status === 'dnd').size
    let kanalOnline = serwerKXN.channels.get('682572761453166716');
    kanalOnline.setName('Online: '+liczbaOnline).then(result => console.log("Kanal Online zmieniony")).catch(err => console.log(err));
}
function backupBazy() {
    var MyDate = new Date(new Date(Date.now()).getTime() + 120*60*1000)
   var MyDateString = '';
   MyDate.setDate(MyDate.getDate());
   var tempoMonth = (MyDate.getMonth()+1);
   var tempoDate = (MyDate.getDate());
   var tempoHour = (MyDate.getHours());
   var tempoMinutes = (MyDate.getMinutes());
   var tempoSeconds = (MyDate.getSeconds());
   if (tempoMonth < 10) tempoMonth = '0' + tempoMonth;
   if (tempoDate < 10) tempoDate = '0' + tempoDate;
   if (tempoHour < 10) tempoHour = '0' + tempoHour;
   if (tempoMinutes < 10) tempoMinutes = '0' + tempoMinutes;
   if (tempoSeconds < 10) tempoSeconds = '0' + tempoSeconds;
   MyDateString = tempoDate + '/' + tempoMonth + '/' + MyDate.getFullYear() + " "+tempoHour+":"+tempoMinutes+":"+tempoSeconds;
    let serwerKXN = client.guilds.get('633229348060659712');
    let kanalBaza = serwerKXN.channels.get('707511813537005572');
    kanalBaza.send(`Backup: ${MyDateString}`, { files: ["./warnings.json", "./lock.json", "./ludzie.json", "./blokady.json", "./sloty.json"]})
}
client.on("ready", () => {
    console.log(`Hi, ${client.user.username} is now online!`);
    setInterval(aktualizujOsoby, 1200000);
    setInterval(aktualizujWidzow, 1200000);
    setInterval(aktualizujOnline, 1200000);
    setInterval(backupBazy, 86400000)
    aktualizujOsoby();
    aktualizujWidzow();
    aktualizujOnline();
    backupBazy();
    client.user.setPresence({
        status: "online",
        game: {
            name: "wszystkich",
            type: "WATCHING"
        }
    }); 
});
client.on("guildMemberAdd", member => {
    var role = member.guild.roles.find('name', 'Community');
    member.addRole(role)
    var warnEmbed = new discord.RichEmbed()	
    .setDescription("Dołączenie na serwer")	
    .setColor("#ee0000")	
    .addField("Dołączył", member)	
    var warnChannel = member.guild.channels.find(`name`, "logi");	
    if (!warnChannel) return console.log("❌ Nie znalazłem kanału do składania zgłoszeń.");	
    warnChannel.send(warnEmbed);
    let serwerKXN = client.guilds.get('633229348060659712');
    let kanalOstatni = serwerKXN.channels.get('682558760346189855');
    kanalOstatni.setName('Ostatni Dołączył: '+member.displayName).then(result => console.log("Kanal Ostatni Dolaczyl zmieniony")).catch(err => console.log(err));
});
client.on('guildMemberRemove', member => {	

    var warnEmbed = new discord.RichEmbed()	
    .setDescription("Wyjście z serwera")	
    .setColor("#ee0000")	
    .addField("Wyszedł", member)	
    var warnChannel = member.guild.channels.find(`name`, "logi");	
    if (!warnChannel) return console.log("❌ Nie znalazłem kanału do składania zgłoszeń.");	
    warnChannel.send(warnEmbed);	
});
function generateMessages() {
    return CONFIG.roles.map((r, e) => {
        return {
            role: r,
            message: `React below to get the **"${r}"** role!`, //DONT CHANGE THIS,
            emoji: CONFIG.reactions[e]
        };
    });
}

// Function to generate the embed fields, based on your settings and if you set "const embed = true;"
function generateEmbedFields() {
    return CONFIG.roles.map((r, e) => {
        return {
            emoji: CONFIG.reactions[e],
            role: r
        };
    });
}

client.on("message", async message => {
    const prefix = "_";
    if(message.channel.id==='639132748925239315'){
        message.react("👍").then(message.react("👎"))
    }
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;
    
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command) 
        command.run(client, message, args);
	if(cmd === CONFIG.setupCMD) {
    // Make sure bots can't run this command
    if (message.author.bot) return;

    // Make sure the command can only be ran in a server
    if (!message.guild) return;

    // We don't want the bot to do anything further if it can't send messages in the channel
    if (message.guild && !message.channel.permissionsFor(message.guild.me).missing('SEND_MESSAGES')) return;

    if ((message.author.id !== CONFIG.yourID) && (message.content.toLowerCase() !== CONFIG.setupCMD)) return;

    if (CONFIG.deleteSetupCMD) {
        const missing = message.channel.permissionsFor(message.guild.me).missing('MANAGE_MESSAGES');
        // Here we check if the bot can actually delete messages in the channel the command is being ran in
        if (missing.includes('MANAGE_MESSAGES'))
            throw new Error("I need permission to delete your command message! Please assign the 'Manage Messages' permission to me in this channel!");
        message.delete().catch(O_o=>{});
    }

    const missing = message.channel.permissionsFor(message.guild.me).missing('MANAGE_MESSAGES');
    // Here we check if the bot can actually add recations in the channel the command is being ran in
    if (missing.includes('ADD_REACTIONS'))
        throw new Error("I need permission to add reactions to these messages! Please assign the 'Add Reactions' permission to me in this channel!");

    if (!CONFIG.embed) {
        if (!CONFIG.initialMessage || (CONFIG.initialMessage === '')) 
            throw "The 'initialMessage' property is not set in the config.js file. Please do this!";

        message.channel.send(CONFIG.initialMessage);

        const messages = generateMessages();
        for (const { role, message: msg, emoji } of messages) {
            if (!message.guild.roles.find(r => r.name === role))
                throw `The role '${role}' does not exist!`;

            message.channel.send(msg).then(async m => {
                const customCheck = message.guild.emojis.find(e => e.name === emoji);
                if (!customCheck) await m.react(emoji);
                else await m.react(customCheck.id);
            }).catch(console.error);
        }
    } else {
        if (!CONFIG.embedMessage || (CONFIG.embedMessage === ''))
            throw "The 'embedMessage' property is not set in the config.js file. Please do this!";
        if (!CONFIG.embedFooter || (CONFIG.embedMessage === ''))
            throw "The 'embedFooter' property is not set in the config.js file. Please do this!";

        const roleEmbed = new RichEmbed()
            .setDescription(CONFIG.embedMessage)
            .setFooter(CONFIG.embedFooter);

        if (CONFIG.embedColor) roleEmbed.setColor(CONFIG.embedColor);

        if (CONFIG.embedThumbnail && (CONFIG.embedThumbnailLink !== '')) 
            roleEmbed.setThumbnail(CONFIG.embedThumbnailLink);
        else if (CONFIG.embedThumbnail && message.guild.icon)
            roleEmbed.setThumbnail(message.guild.iconURL);

        const fields = generateEmbedFields();
        if (fields.length > 25) throw "That maximum roles that can be set for an embed is 25!";

        for (const { emoji, role } of fields) {
            if (!message.guild.roles.find(r => r.name === role))
                throw `The role '${role}' does not exist!`;

            const customEmote = client.emojis.find(e => e.name === emoji);
            
            if (!customEmote) roleEmbed.addField(emoji, role, true);
            else roleEmbed.addField(customEmote, role, true);
        }

        message.channel.send(roleEmbed).then(async m => {
            for (const r of CONFIG.reactions) {
                const emoji = r;
                const customCheck = client.emojis.find(e => e.name === emoji);
                
                if (!customCheck) await m.react(emoji);
                else await m.react(customCheck.id);
            }
        });
    }
	}
});
// This makes the events used a bit more readable
const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

// This event handles adding/removing users from the role(s) they chose based on message reactions
client.on('raw', async event => {
    if (!events.hasOwnProperty(event.t)) return;

    const { d: data } = event;
    const user = client.users.get(data.user_id);
    const channel = client.channels.get(data.channel_id);

    const message = await channel.fetchMessage(data.message_id);
    const member = message.guild.members.get(user.id);

    const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    let reaction = message.reactions.get(emojiKey);

    if (!reaction) {
        // Create an object that can be passed through the event like normal
        const emoji = new Emoji(client.guilds.get(data.guild_id), data.emoji);
        reaction = new MessageReaction(message, emoji, 1, data.user_id === client.user.id);
    }

    let embedFooterText;
    if (message.embeds[0]) embedFooterText = message.embeds[0].footer.text;

    if (
        (message.author.id === client.user.id) && (message.content !== CONFIG.initialMessage || 
        (message.embeds[0] && (embedFooterText !== CONFIG.embedFooter)))
    ) {

        if (!CONFIG.embed && (message.embeds.length < 1)) {
            const re = `\\*\\*"(.+)?(?="\\*\\*)`;
            const role = message.content.match(re)[1];

            if (member.id !== client.user.id) {
                const guildRole = message.guild.roles.find(r => r.name === role);
                if (event.t === "MESSAGE_REACTION_ADD") member.addRole(guildRole.id);
                else if (event.t === "MESSAGE_REACTION_REMOVE") member.removeRole(guildRole.id);
            }
        } else if (CONFIG.embed && (message.embeds.length >= 1)) {
            const fields = message.embeds[0].fields;

            for (const { name, value } of fields) {
                if (member.id !== client.user.id) {
                    const guildRole = message.guild.roles.find(r => r.name === value);
                    if ((name === reaction.emoji.name) || (name === reaction.emoji.toString())) {
                        if (event.t === "MESSAGE_REACTION_ADD") member.addRole(guildRole.id);
                        else if (event.t === "MESSAGE_REACTION_REMOVE") member.removeRole(guildRole.id);
                    }
                }
            }
        }
    }
});

client.login(config.token)
//MASTER