const { MessageAttachment } = require("discord.js");

module.exports = function(client,bnetClient,tsmclient) {
    
    client.on('message', msg => {
        if(msg.content.startsWith('::Token')){
            bnetClient.getTokenPrice().then(res => {
                bnetClient.getItemMediaByID(122284).then( media => {
                    const { MessageEmbed } = require('discord.js');
                    const embed = new MessageEmbed()
                    .setTitle('Current Token Price :')
                    .setColor(0xffe507)
                    .setDescription(`${res.toString().substring(0,3)+','+res.toString().substring(3,6)} Golds`)
                    .setThumbnail(media.assets[0].value); 
                    msg.reply(embed);  
                }).catch(err => {console.log(err)});
            }).catch(err => {console.log(err)});
                
        }
        if(msg.content.startsWith('::Price')){
            let item = msg.content.split('[').pop().split(']')[0];
            tsmclient.getItemDatabyFrenchName(item).then((res) => {
                bnetClient.getItemMediaByID(res.Id).then((media) => {
                    const { MessageEmbed } = require('discord.js');
                    const embed = new MessageEmbed()
                    .setTitle(`Information de l'hôtel des ventes pour [${item}]`)
                    .setColor(0xffe507)
                    .setDescription(`Prix : ${Math.floor(res.MinBuyout/10000)} PO \n Valeur moyenne : ${Math.floor(res.RegionMarketAvg/10000)} PO \n Quantité : ${res.Quantity} \n Il y'a environ ${res.RegionAvgDailySold} ventes par jours \n`)
                    .setThumbnail(media.assets[0].value)
                    .setURL(res.URL);
                    msg.reply(embed);
                }).catch((err) => {console.error(err)});
            }).catch((err) => {
                tsmclient.getItemDatabyEnglishName(item).then((res) => {
                    bnetClient.getItemMediaByID(res.Id).then((media) => {
                        const { MessageEmbed } = require('discord.js');
                        const embed = new MessageEmbed()
                        .setTitle(`Auctions House information for [${item}]`)
                        .setColor(0xffe507)
                        .setDescription(`Price : ${Math.floor(res.MinBuyout/10000)} Golds \n Average value : ${Math.floor(res.RegionMarketAvg/10000)} Golds \n Quantity : ${res.Quantity} \n there are about ${res.RegionAvgDailySold} sales per day \n`)
                        .setThumbnail(media.assets[0].value)
                        .setURL(res.URL);
                        msg.reply(embed);
                    }).catch((err) => {console.error(err)});
                }).catch((err) => {msg.reply('Item Not Found !')});   
            });
        }
        if(msg.content.startsWith('::Help')){
            const { MessageEmbed } = require('discord.js');
            const embed = new MessageEmbed()
            .setTitle(`All commands :`)
            .setColor(0xff507)
            .setDescription(` ::Token => return WOW Token price on ${require("../environnement").REGION}\n ::Price [ITEMNAME] => return statistics of this item on ${require("../environnement").REGION}-${require("../environnement").REALM} \n (example : '::Price [Deep Sea Bag]' or '::Price [Sac des abysses]' )`)
            .setThumbnail('https://i.imgur.com/pQP4T8V.jpeg')
            msg.reply(embed);
        }
    });

}