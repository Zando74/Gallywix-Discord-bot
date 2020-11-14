const { MessageAttachment } = require("discord.js");

module.exports = function(client,bnetClient,tsmclient) {
    
    client.on('message', msg => {
        if(msg.content.startsWith('::TokenPrice')){
            bnetClient.getTokenPrice().then(res => {
                const { MessageEmbed } = require('discord.js');
                const embed = new MessageEmbed()
                .setTitle('Current Token Price :')
                .setColor(0xffe507)
                .setDescription(`${res.toString().substring(0,3)+','+res.toString().substring(3,6)} Golds`)
                .setThumbnail('https://i.imgur.com/pQP4T8V.jpeg'); 
                msg.reply(embed);  
                }).catch(err => {console.log(err)});
        }
        if(msg.content.startsWith('::GetPriceFR')){
            let item = msg.content.split('[').pop().split(']')[0];
            tsmclient.getItemDatabyFrenchName(item).then((res) => {
                bnetClient.getItemMediaByID(res.Id).then((media) => {
                    const { MessageEmbed } = require('discord.js');
                    const embed = new MessageEmbed()
                    .setTitle(`Information de l'hôtel des ventes pour [${item}]`)
                    .setColor(0xffe507)
                    .setDescription(`Prix : ${Math.floor(res.MinBuyout/1000)} PO \n Valeur moyenne : ${Math.floor(res.RegionMarketAvg/1000)} PO \n Quantité : ${res.Quantity} \n Il y'en a environ ${res.RegionAvgDailySold} vendus chaque jours \n`)
                    .setThumbnail(media.assets[0].value)
                    .setURL('https://'+res.URL);
                    msg.reply(embed);
                }).catch((err) => {console.error(err)});
            }).catch((err) => {console.error(err)});
        }
    });

}