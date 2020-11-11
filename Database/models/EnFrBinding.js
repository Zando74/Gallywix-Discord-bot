const mongoose = require('mongoose');

const EnFrBindingSchema = new mongoose.Schema({
    EnName : {
        type : String
    },
    FrName : {
        type : String
    }
});

const EnFrBinding = mongoose.model('EnFrBinding', EnFrBindingSchema);
module.exports = EnFrBinding;