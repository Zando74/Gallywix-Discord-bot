const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const environnement = require('../environnement');

module.exports = class TSMApi {
    constructor() {
        this.http = require('http');
        this.apiKey = require("../environnement").TSM_API_KEY;
        this.URL = "http://api.tradeskillmaster.com/v1";
        this.region = require("../environnement").REGION.toUpperCase(),
        this.realm = require("../environnement").REALM,
        this.Item = require('../Database/models/Item');
        this.EnFrBinding = require('../Database/models/EnFrBinding');
    }

    getAllHV() {
        return new Promise((resolve,reject) => {
            const url = new URL(`${this.URL}/item/${this.region}/${this.realm}?format=json&apiKey=${this.apiKey}`);
            const requestOptions = {
                headers : {
                    'User-Agent' : 'GallywixDiscordBot'
                }
            }
            let responseData = "";
            function requestHandler(res) {
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                res.on('end', () => {
                    let data = JSON.parse(responseData);
                    resolve(data);
                });
            }
            let request = this.http.get(url,requestOptions,requestHandler);
            request.on('error', (error) => { reject(error)});
            request.end();
        });
    }

    dropDataBase() {
        this.Item.collection.drop().catch((err) => {if(err.message !== 'ns not found') throw err;});
    }

    updateDataBase() {
        return new Promise((resolve,reject) => {
            this.dropDataBase();
            console.log("Updating items informations from auction house...")
            this.getAllHV().then( (res) => {
            res.forEach( (item,index) => {
                const newItem = new this.Item({
                    Id: item.Id, 
                    Name : item.Name,
                    MartketValue: item.MarketValue,
                    MinBuyout : item.MinBuyout,
                    Quantity : item.Quantity,
                    NumAuctions : item.NumAuctions,
                    RegionMarketAvg : item.RegionMarketAvg,
                    RegionAvgDailySold : item.RegionAvgDailySold,
                    URL : `https://theunderminejournal.com/#${require('../environnement').REGION}/${require('../environnement').REALM}/item/${item.Id}`
                });
                newItem.save((err) => {
                    if(err) reject(err)
                    if(index == res.length-1){
                        resolve('its done');
                    }
                });
                
            });
        });
        })
        
    }

    translateDataBase(bnetClient) {
        this.Item.find({},(err,items) => {
            this.translateRecursivly(bnetClient,items,0);
        });
    }

    translateRecursivly(bnetClient,items,i) {
        this.EnFrBinding.findOne({ EnName : items[i].Name }, (err,itemName) => {
            if(itemName === null){
                bnetClient.getFrenchNameOfAnItem(items[i].Name).then((FrName) => {
                    console.log(`Traduction de ${items[i].Name} en ${FrName} -- ${i}/${items.length-1}`);
                    const newFrEnBinding = new this.EnFrBinding({
                        EnName : items[i].Name,
                        FrName : FrName
                    });
                    newFrEnBinding.save((err) => {
                        if(err){
                            console.log(err)
                        }else {
                            if(i < items.length){
                                i+=1;
                                this.translateRecursivly(bnetClient,items,i);
                            }
                        }
                    });
                }).catch(err => console.log(err));
            }else{
                if(i < items.length-1){
                    i+=1;
                    this.translateRecursivly(bnetClient,items,i);
                }else{
                    console.log("Tout les objets ont été traduis !")
                }
            }
            
        });
    }

    getItemDatabyFrenchName(FrName){
        return new Promise((resolve,reject) => {
            this.EnFrBinding.findOne({FrName : FrName}, (err,itemFR) => {
                if(itemFR === null){
                    reject("Not found");
                }else{
                    this.Item.findOne({Name : itemFR.EnName},(err,item) =>{
                        if(item === null){
                            reject("Not found")
                        }else{
                            resolve(item.toJSON());
                        }
                    })
                }
            })
        })
        
    }

    getItemDatabyEnglishName(EnName){
        return new Promise((resolve,reject) => {
            this.Item.findOne({ Name : EnName}, (err,item) => {
                if(item === null){
                    reject("Not found");
                }else{
                    resolve(item.toJSON());
                }
            })
        })
    }

}