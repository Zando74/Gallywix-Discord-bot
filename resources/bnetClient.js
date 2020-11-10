module.exports = class BnetAPI{
    constructor() {
        return new Promise((resolve,reject) => {
            this.https = require('https');
            this.clientID = require("../environnement").BNET_CLIENT_ID;
            this.clientSecret = require("../environnement").BNET_CLIENT_SECRET;
            this.createAccessToken().then((res) => { 
                this.access_token = res.access_token;
                resolve(this) 
            }).catch((err) => {reject(err)});
        });
    }

    createAccessToken(region='eu'){
        return new Promise((resolve,reject) => {
            let credentials = Buffer.from(`${this.clientID}:${this.clientSecret}`);
            const requestOptions = {
                host: `${region}.battle.net`,
                path: `/oauth/token`,
                method: 'POST',
                headers: {
                    'Authorization':`Basic ${credentials.toString('base64')}`,
                    'Content-Type':  'application/x-www-form-urlencoded'
                }
            };
            let responseData = '';
            function requestHandler(res) {
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                res.on('end',() => {
                    let data = JSON.parse(responseData);
                    resolve(data);
                });
            }
            let request = this.https.request(requestOptions,requestHandler);
            request.write('grant_type=client_credentials');
            request.end();
            request.on('error',(error) => {
                reject(error);
            });
        });
    }

    genereateRequestOptions(region){
        return {
                host: `${region}.api.blizzard.com`,
                path: `/data/wow/token/?namespace=dynamic-${region}`,
                method: 'GET',
                headers: 
                    {
                        'Authorization': `Bearer ${this.access_token}`
                    }
                }
    }

    getTokenPrice(region='eu'){
        return new Promise((resolve,reject) => {
            let responseData = '';
            function requestHandler(res) {
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                res.on('end',() => {
                    let data = JSON.parse(responseData);
                    resolve(data.price);
                });
            }
            let request = this.https.request(this.genereateRequestOptions(region),requestHandler);
            request.end();
            request.on('error',(error) => {
                reject(error);
            });
        });
        
    }

}