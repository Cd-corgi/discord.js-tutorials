const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageSelectMenu, MessageButton, MessageActionRow } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    permissions: ["SEND_MESSAGES"],
    botp: ["SEND_MESSAGES"],
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("just a help command bro!"),
    async run(client, interaction){
        const embed1 = new MessageEmbed()
        .setTitle("Main page!")

        const page1 = new MessageEmbed()
        .setTitle("page 1")

        const page2 = new MessageEmbed()
        .setTitle("page 2")

        const page3 = new MessageEmbed()
        .setTitle("page 3")

        let index = 0; //embed Counter

        // arrays

        let embedPages = [
            page1,
            page2,
            page3
        ]

        // buttons and menu

        let rowmenu = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
            .setCustomId("nav")
            .setMaxValues(1)
            .setMinValues(1)
            .addOptions([
                {
                    label: "Home",
                    description: "Go back to the Embed title!",
                    emoji: "🏠",
                    value: "home"
                },
                {
                    label: "Pages",
                    description: "Explore the pages!",
                    emoji: "ℹ",
                    value: "pages"
                }
            ])
        )

        let rowButtons = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId("redo")
            .setEmoji("◀")
            .setStyle("SECONDARY")
        )
        .addComponents(
            new MessageButton()
            .setCustomId("delete")
            .setEmoji("❌")
            .setStyle("SECONDARY")
        )
        .addComponents(
            new MessageButton()
            .setCustomId("ford")
            .setEmoji("▶")
            .setStyle("SECONDARY")
        )

        //disabled buttons
        let rowDisabled = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId("redo")
            .setEmoji("◀")
            .setStyle("SECONDARY")
            .setDisabled(true)
        )
        .addComponents(
            new MessageButton()
            .setCustomId("delete")
            .setEmoji("❌")
            .setStyle("SECONDARY")
            .setDisabled(true)
        )
        .addComponents(
            new MessageButton()
            .setCustomId("ford")
            .setEmoji("▶")
            .setStyle("SECONDARY")
            .setDisabled(true)
        )

        let msg = await interaction.reply({
            embeds: [embed1],
            components: [rowmenu, rowDisabled]
        })

        //filters

        const filter = i => i.user.id === interaction.user.id;

        const menuCollector = interaction.channel.createMessageComponentCollector({
            componentType: "SELECT_MENU",
            filter,
            time: 30000
        })

        const buttonCollector = interaction.channel.createMessageComponentCollector({
            componentType: "BUTTON",
            filter,
            time: 30000
        })

        menuCollector.on("collect", async (i) => {
            if(i.values[0] === "home") {
                await i.deferUpdate()
                i.editReply({
                    embeds: [embed1],
                    components: [rowmenu, rowDisabled]
                })
                menuCollector.resetTimer();
            }
            if(i.values[0] === "pages") {
                await i.deferUpdate()
                i.editReply({
                    embeds: [embedPages[index]],
                    components: [rowmenu, rowButtons]
                })
                menuCollector.resetTimer();
            }
        })

        buttonCollector.on("collect", async (i) => {
            if(i.customId === "redo") {
                await i.deferUpdate()

                index = index > 0 ? --index : embedPages.length - 1;

                i.editReply({
                    embeds: [embedPages[index]],
                    components: [rowmenu, rowButtons]
                })
                buttonCollector.resetTimer();
            }

            if(i.customId === "delete") {
                await i.deferUpdate()
                i.deleteReply();
            }

            if(i.customId === "ford") {
                await i.deferUpdate()

                index = index + 1 < embedPages.length ? ++ index : 0;

                i.editReply({
                    embeds: [embedPages[index]],
                    components: [rowmenu, rowButtons]
                })
                buttonCollector.resetTimer();
            }
        });

        //end of the collectors!

        menuCollector.on("end", async collected => {
            rowmenu.components[0].setDisabled(true)
            interaction.editReply({
                components: [rowmenu, rowDisabled]
            })
        })

        buttonCollector.on("end", async collected => {
            rowmenu.components[0].setDisabled(true)
            interaction.editReply({
                components: [rowmenu, rowDisabled]
            })
        })

    }
}