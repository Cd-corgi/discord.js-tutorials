const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("youtube-together")
    .setDescription("Allows you join in a in-discord app"),
    async run(client, interaction){
        
        const invc = interaction.member.voice;

        if(!invc) return interaction.reply({
            content: "Please connect to a vc to generate your yt-together link"
        })

        // You can replace the 'youtube' with:

        /* 
         *  'chess' = chess game
         *  'betrayal' = Betrayal Game
         *  'poker' = Poker game
         *  'fish' = Fishing game
        */

        client.discordTogether.createTogetherCode(interaction.member.voice.channel.id, 'youtube').then(async invite => {
            interaction.reply({
                content: `Press the blue link, no buttons! ${invite.code}`
            })
        })
    }
}