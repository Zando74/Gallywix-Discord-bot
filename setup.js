/* SETUP ENVIRONNEMENT */
var fs = require('fs');
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
                            Realm = Realm.charAt(0).toUpperCase() + Realm.slice(1);
                            Response = Response.toUpperCase();
                            console.log("This information will be saved !")
                            console.log(DiscordToken,ClientID,ClientSecret,Region, Realm, Response);
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
                                    console.log("setup is done if there is no error, npm start will work, If there is errors in your information please run setup again");
                                }
                            )
                            rl.close();
                        });
                    }) 
                })
            })
        })
    })
})
