const Discord = require('discord.js');
const client = new Discord.Client();
const BnetClient = require('./resources/bnetClient');
const mongoose = require('./Database/mongoose');
const { mongo } = require('./Database/mongoose');


new BnetClient().then(bnetClient => {
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag} !`);
        client.user.setPresence({ activity: { name : 'World of Warcraft'}, status: 'online'}).catch(console.error);
    });
    mongoose.connect('mongodb://127.0.0.1:27017/Gallywix',{ useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => 
    {
        const TsmClient = require("./resources/TradeSkillMasterClient");
        let tsmclient = new TsmClient();
        tsmclient.updateDataBase().then( (res) => {
            console.log("All data have been saved");
            if(require('./environnement').FRENCHMODE == 'YES'){
                console.log("FRENCHMODE is enable translating the base (if it's the first execution it will be take a long time)")
                tsmclient.translateDataBase(bnetClient);
            }

        }).catch(err => { console.log(error)});

    }).catch((err) => console.error(err));
    
    require('./resources/commands')(client,bnetClient);
    client.login(require('./environnement').DISCORD_TOKEN);
})




