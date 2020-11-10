const Discord = require('discord.js');
const client = new Discord.Client();
const BnetClient = require('./resources/bnetClient');


new BnetClient().then(bnetClient => {
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag} !`);
    });
    
    client.on('message', msg => {
        if(msg.content === 'token wow'){
            bnetClient.getTokenPrice().then(res => {
                msg.reply(`Le prix actuel du jeton est de ${res.toString().substring(0,6)} gold !`);
            }).catch(err => {console.log(err)});
            
        }
    });
    client.login(require('./environnement').DISCORD_TOKEN);
})




