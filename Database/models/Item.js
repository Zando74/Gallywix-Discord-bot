const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    Id : {
        type: Number,
    },
    Name : {
        type: String,
    },
    MarketValue: {
        type: Number
    },
    MinBuyout : {
        type: Number
    },
    Quantity : {
        type : Number
    },
    NumAuctions : {
        type : Number
    },
    RegionMarketAvg : {
        type : Number
    },
    RegionAvgDailySold : {
        type : Number
    },
    URL : {
        type : String
    }
});

const Item = mongoose.model('Item', ItemSchema);
module.exports = Item;