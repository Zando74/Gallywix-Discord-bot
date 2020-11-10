const { MessageAttachment } = require("discord.js");

module.exports = function(client,bnetClient) {
    
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
        
    });

}