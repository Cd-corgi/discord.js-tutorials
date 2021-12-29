const Discord = require('discord.js');
const client = new Discord.client({
    intents: 32767,
    allowedMentions: false
})
const { DiscordTogether } = require('discord-together');
const fs = require('fs');
const { readdirSync } = require('fs')
const { token } = require('./src/public/config.json');
const { prefix } = require('./src/public/config.json');
require('colors')


client.discordTogether = new DiscordTogether(client);

process.on('unhandledRejection', error => {
    console.error(`[UNHANDLED ALARM] ${error}`.blue);
});

client.on('shardError', error => {
    console.error(`[SHARD ALARM] ${error}`.blue);
});

client.slashCommands = new Discord.Collection();
const slh = fs.readdirSync("./src/slash/").filter(file => file.endsWith('.js'));

for(const file of slh) {
    const scmd = require(`./src/slash/${file}`)
    client.slashCommands.set(scmd.data.name, scmd);
    console.log(`[⚠ SLASH] ${file} have been loaded!`.yellow);
}

client.on("messageCreate", async(message) => {
    if(message.author.bot) return
    if(!message.guild || message.channel.type === "dm") return


})

client.login(token)