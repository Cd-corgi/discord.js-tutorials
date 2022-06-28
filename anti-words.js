const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const NoWords = require("../../models/anti-word")

module.exports = {
    permissions: ["MANAGE_MESSAGES", "MANAGE_CHANNELS"],
    botp: ["MANAGE_CHANNELS", "MANAGE_MESSAGES"],
    data: new SlashCommandBuilder()
        .setName("anti-words")
        .setDescription("put some words to be censored!")
        //to add the words
        .addSubcommand(option =>
            option
                .setName("add")
                .setDescription("Add the words to censore!")
                .addStringOption(option =>
                    option
                        .setName("word")
                        .setDescription("Provide the word!")
                        .setRequired(true)
                )
        )
        //to remove the words
        .addSubcommand(option =>
            option
                .setName("remove")
                .setDescription("Remove the words to censore!")
                .addStringOption(option =>
                    option
                        .setName("word")
                        .setDescription("Provide the word!")
                        .setRequired(true)
                )
        ),
    async run(client, interaction) {
        //declare the subcommands and strings
        let SN = await NoWords.findOne({ guildID: interaction.guild.id })
        const wor = interaction.options.getString("word")
        const subC = interaction.options.getSubcommand()

        // switch & case moment

        switch (subC) {
            case "add":

                // in case that theres no data
                if (!SN) {
                    new NoWords({
                        guildID: interaction.guild.id,
                        blacklist: [{
                            word: wor
                        }]
                    }).save();

                    await interaction.deferReply()
                    return interaction.followUp({
                        content: `✅ Word Blacklisted!`
                    }).then(() => setTimeout(() => interaction.deleteReply(), 5000))
                        .catch(err => { })
                }

                //in case not.

                if (wor.length > 10) {
                    await interaction.deferReply({ ephemeral: true })
                    return interaction.followUp(`This word should be less of 10 characters!`)
                }

                //in case that the db detects the same registered word

                if (SN.blacklist.some(v => v.word.toLowerCase() === wor.toLowerCase())) {
                    await interaction.deferReply({ ephemeral: true })
                    return interaction.followUp(`This provided word is already registered in the Blacklist!`)
                }

                //let's save the result

                SN.blacklist.push({ word: wor })

                await NoWords.findOneAndUpdate({ guildID: interaction.guild.id }, { blacklist: SN.blacklist })

                await interaction.deferReply()
                interaction.followUp(`✅ Word Blacklisted!`).then(() => setTimeout(() => interaction.deleteReply(), 5000))
                    .catch(err => { })

                break;

            case "remove":
                // in case that the guild ID can't be found
                if (!SN) {
                    await interaction.deferReply({ ephemeral: true })
                    return interaction.followUp(`The guild couldn't be found by the db ...`)
                }

                // in case that the word is not in the blacklist!
                if (!SN.blacklist.some(v => v.word.toLowerCase() === wor.toLowerCase())) {
                    await interaction.deferReply({ ephemeral: true })
                    return interaction.followUp(`Provided word is not in the blacklist yet!`)
                }

                // this filter only the words that are different than the provided one!
                SN.blacklist = SN.blacklist.filter(v => v.word !== wor)

                // commiting changes
                await NoWords.findOneAndUpdate({ guildID: interaction.guild.id }, { blacklist: SN.blacklist })

                await interaction.deferReply()
                interaction.followUp(`📜 Word removed from the Blacklist!`)
                    .then(() => setTimeout(() => interaction.deleteReply(), 5000))
                    .catch(err => { })
                break;

            default:
                break;
        }

    }
}