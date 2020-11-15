const Discord = require('discord.js');
const client = new Discord.Client();
const BnetClient = require('./resources/bnetClient');
const mongoose = require('./Database/mongoose');
const { mongo } = require('./Database/mongoose');


new BnetClient().then(bnetClient => {
    client.on('ready', () => {
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
                console.log("Le mode FR est activé, traductions des noms...")
                tsmclient.translateDataBase(bnetClient);
                setInterval(() => {tsmclient.translateDataBase(bnetClient)},3600000);
            }
            require('./resources/commands')(client,bnetClient,tsmclient);
            client.login(require('./environnement').DISCORD_TOKEN);

        }).catch(err => { console.log(error)});

    }).catch((err) => console.error(err));
    
    
})




