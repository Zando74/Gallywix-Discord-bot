/* SETUP ENVIRONNEMENT */
var fs = require('fs');
const { exit } = require('process');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Please enter your Discord App Token : \n", (DiscordToken) => {
    rl.question("Please enter your Battle.net Client ID \n", (ClientID) => {
        rl.question("Please enter your Battle.net Client Secret \n",(ClientSecret) => {
            rl.question("Please enter your TSM Api Key \n", (TsmApiKey) => {
                rl.question("Please enter your Region \n", (Region) => {
                    rl.question("Please enter your Realm \n", (Realm) => {
                        rl.question("Do you want to enable frenchMode (It's allow you to ask the bot for item by his french name) \n"
                        +"If you enable this the first execution of the program will take a lot of time in order to create the translation database \n",(Response)=> {
                            Region = Region.toLowerCase();
                            Realm = Realm.charAt(0).toUpperCase() + Realm.slice(1);
                            Response = Response.toUpperCase();
                            console.log("This information will be saved, make sure there are valid !")
                            console.log(`DiscordToken : ${DiscordToken}`,`ClientID : ${ClientID}`,`ClientSecret : ${ClientSecret}` ,`Region : ${Region}`,`Realm : ${Realm}`,`Response : ${Response}`);
                            fs.writeFile('environnement.js', 
                                `module.exports = {
    DISCORD_TOKEN : "${DiscordToken}",
    BNET_CLIENT_ID : "${ClientID}",
    BNET_CLIENT_SECRET : "${ClientSecret}",
    TSM_API_KEY : "${TsmApiKey}",
    REGION : "${Region}",
    REALM : "${Realm}",
    FRENCHMODE : "${Response}"
}`,
                            (err) => {
                                    if (err) throw err;
                                    console.log("Environnement.js file is created you can modify it if there are errors,\n if informations are valid npm start will work !");
                                }
                            )
                            rl.close();
                            if(Response == 'YES'){
                                console.log("Vous avez choisis le mode Français assurez vous de posseder le fichier FrenchDB !")
                                const mongoose = require('./Database/mongoose');
                                let EnFrBinding = require('./Database/models/EnFrBinding');
                                mongoose.connect('mongodb://127.0.0.1:27017/Gallywix',{ useNewUrlParser: true, useUnifiedTopology: true})
                                    .then(() => 
                                    {
                                        console.log("Création de la base de donnée à partir de FrenchDB.json");
                                        EnFrBinding.collection.drop().then(res => {}).catch(err => {console.log(err)});
                                        fs.readFile("./FrenchDB.json", (err,data) => {
                                            if(err)
                                                console.log(err);
                                            let DB = JSON.parse(data)
                                            DBclean = DB.map(
                                                (item) =>{ return { "EnName" : item.EnName,
                                                            "FrName" : item.FrName}
                                            })
                                            EnFrBinding.insertMany(DBclean,(err,res) => {
                                                if(err){
                                                    console.log(err)
                                                }else{
                                                    console.log("Base de donnée de traduction sauvegardée. \n L'installation c'est bien passé !");
                                                    exit(0);
                                                }
                                            })
                                        })
                                    })
                            }
                        });
                    }) 
                })
            })
        })
    })
})


