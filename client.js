const Discord = require('discord.js');
const client = new Discord.Client();
const BnetClient = require('./resources/bnetClient');


new BnetClient().then(bnetClient => {
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag} !`);
        client.user.setPresence({ activity: { name : 'World of Warcraft'}, status: 'online'}).catch(console.error);
    });
    
    require('./resources/commands')(client,bnetClient);

    client.login(require('./environnement').DISCORD_TOKEN);
    
})




